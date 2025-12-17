import React, { useState, useRef,useEffect } from 'react'
import type { review, Users } from '../../Types/ProductDetailsType'
import { MdDelete } from "react-icons/md";
import ModelDelete from './ModalDelete';
import { useTranslation } from 'react-i18next';
import Swal from "sweetalert2";
type Props = {
  reviews: review[];
  users: Users[] | undefined;
  onDelete: (id: string) => void;
}
export default function ReviewCard({ reviews, users, onDelete }: Props) {



 const [expandedId, setExpandedId] = useState<{ [key: string]: boolean }>({});
  const Max_Length = 5;
  const sliderRef = useRef<HTMLDivElement>(null);
  const {t} =useTranslation();

  useEffect(()=>{
     const slider = sliderRef.current;
      if (!slider) return;
       let scrollIndex = 0;
       const interval = setInterval(() => {
      const cardWidth = slider.children[0]?.clientWidth || 0;
       scrollIndex += cardWidth;
       if (scrollIndex >= slider.scrollWidth - slider.clientWidth) {
        scrollIndex = 0;
      }
     slider.scrollTo({
        left: scrollIndex,
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  },[]);

  const handleDeleteReview = async(id: string) => {
  
          const result = await Swal.fire({
            title: t("ProductDetails.deleteReviewTitle"),
            text: t("ProductDetails.deleteReviewText"),
            icon: "error",
            showCancelButton: true,
            confirmButtonText: t("ProductDetails.deleteReviewConfirm"),
            cancelButtonText: t("ProductDetails.deleteReviewCancel"),
            reverseButtons: true,
            confirmButtonColor: "red",
          });
    
          if (!result.isConfirmed) return;
    
          Swal.fire({
            title:t("ProductDetails.deleteReviewloading"),
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
    
          await onDelete (id);
        }
  
  return (
    <>
    <div
      ref={sliderRef}
      dir="ltr"  
      className="flex items-start  overflow-x-hidden scroll-smooth no-scrollbar px-2"
    >
    {reviews.map((review) => {
                const user = users?.find(
                  (user) => user._id === review.user._id
                );
                if (!user) return null;
                
                return(<div
    key={review._id}
      className='bg-white rounded-2xl max-w-[48%] md:w-72    p-5 ml-2 shadow-md mb-4 border border-gray-200 relative  flex-shrink-0'>
      <button onClick={() => handleDeleteReview(review._id)} className='absolute top-5 right-3 text-red-500 hover:text-red-600  z-20'>
        <MdDelete className="text-xl" />
      </button>
      <div className='flex items-center gap-3 mb-3'>
        <img src={user?.image.secure_url || "/default-avatar.png"}
          alt={user?.userName}
          className='w-10 h-10 rounded-full object-cover border'
        />
        <h3 className="text-lg font-semibold text-gray-800"
        >{review.user.userName}</h3>
      </div>
      <div className='flex items-center mb-2'>
        {Array.from({ length: 5 }).map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill={index < review.rate ? "#f59e0b" : "#d1d5db"}
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.787 1.48 8.247L12 18.896l-7.416 4.444 1.48-8.247L0 9.306l8.332-1.151z" />

          </svg>
        ))}

      </div>

      <p className='text-gray-700 leading-relaxed '>{expandedId[review._id] ? review.comment : review.comment.split(" ").slice(0, Max_Length).join(" ")}{review.comment.split(" ").length > Max_Length && (
        <span
          className='text-[var(--color-light-accent)]  cursor-pointer ml-1'
          onClick={() => setExpandedId(prev=>({
            ...prev,
            [review._id]: !prev[review._id]
          }))}
        >
          {expandedId[review._id]? t("ProductDetails.showLess") : t("ProductDetails.readMore")}
        </span>
      )}</p>
    
    </div>
   );
      })}
      </div>
    </>
  );
}
