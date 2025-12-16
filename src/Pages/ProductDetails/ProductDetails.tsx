import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import type {
  productdetails,
  review,
  Users,
} from "../../Types/ProductDetailsType";
import { baseURL } from "../../Apis/BaseUrl";
import { toast, ToastContainer } from "react-toastify";
import { FaPaw } from "react-icons/fa";

import RelatedProductsSlider from "./RelatedProductsSlider";
import Loader from "./Loader";
import ErrorLoader from "./ErrorLoader";
import BackButton from "./BackButton";
import ErrorMessage from "./ErrorMessage";
import ReviewModal from "./ReviewModal";
import ToggleButton from "./ToggleButton";
import ReviewCard from "./ReviewCard";
import ReviewButton from "./ReviewButton";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showFull, setShowFull] = useState(false);
  const token = localStorage.getItem("accessToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const queryClient = useQueryClient();
  const {t} =useTranslation();
  //get product
  async function getproductdetails() {
    const { data } = await axios.get(`${baseURL}/products/${id}`);
    return data.data;
  }
  let { isLoading, isError, data } = useQuery<productdetails>({
    queryKey: ["productdetails", id],
    queryFn: getproductdetails,
  });

  // related product
  async function getrelatedproducts() {
    const { data } = await axios.get(`${baseURL}/products/related/${id}`);
    return data.relatedProducts;
  }
  let {
    isLoading: relatedLoading,
    isError: relatedError,
    data: relatedProducts,
  } = useQuery<productdetails[]>({
    queryKey: ["relatedproducts", id],
    queryFn: getrelatedproducts,
  });
  // get review
  async function getreviews() {
    const { data: reviews } = await axios.get(
      `${baseURL}/reviews/productReviews/${id}`,
      {
        headers: {
          authentication: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(reviews.data);
    return reviews.data;
  }
  let {
    isLoading: reviewloading,
    isError: reviewError,
    data: reviewdata,
  } = useQuery<review[]>({
    queryKey: ["Reviews", id],
    queryFn: getreviews,
  });
  // get user
  async function getuser() {
    const { data: user } = await axios.get(`${baseURL}/user/allUsers`, {
      headers: {
        authentication: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(user.data);
    return user.data;
  }
  const { data: userdata } = useQuery<Users[]>({
    queryKey: ["users"],
    queryFn: getuser,
  });
  // DELETE REVIEW
  const deletereview = useMutation({
    mutationFn: async (reviewId: string) => {
      await axios.delete(`${baseURL}/reviews/${reviewId}`, {
        headers: {
          authentication: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Review deleted successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      queryClient.invalidateQueries({ queryKey: ["Reviews", id] });
    },
    onError: (error) => {
      console.log("delete review error:", error);
      toast.error("Failed to delete Review ", { position: "top-center" });
    },
  });
  // add review
  const addreview = useMutation({
    mutationFn: async (newReview: { rate: number; comment: string }) => {
      const { data } = await axios.post(
        `${baseURL}/reviews/`,
        {
          product: id,
          rate: newReview.rate,
          comment: newReview.comment,
        },
        {
          headers: {
            authentication: `bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("new review", data);
      return data;
    },
    onSuccess: () => {
      toast.success("Review added successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      queryClient.invalidateQueries({ queryKey: ["Reviews", id] });
    },
    onError: (error) => {
      console.log("add review error", error);
      toast.error("Failed to add review", { position: "top-center" });
    },
  });
  if (isLoading) return <Loader />;

  if (isError) {
    return <ErrorLoader />;
  }

  if (!data) return null;
  //counter
  const handleIncrease = () => {
    console.log(data.stock);
    if (quantity < data.stock) setQuantity(quantity + 1);
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // jsx
  return (
    <>
      <div className="bg-[var(--color-light-background)] min-h-screen  relative">
        <BackButton />
        <div className="max-w-6xl mx-auto pt-16">
          <div className="flex flex-col md:flex-row  gap-10 items-center md:items-start  md:justify-between">
            <div className="flex flex-col items-center">
              <div className=" bg-white rounded-2xl overflow-hidden flex items-center justify-center w-[400px] h-[400px] shadow-lg">
                <img
                  src={selectedImage || data.imageCover.secure_url}
                  alt={data.title}
                  className="w-full h-full  "
                />
              </div>

              <div className="flex gap-3 mt-5">
                {[data.imageCover, ...data.subImages].map((img, index) => (
                  <img
                    key={index}
                    src={img.secure_url}
                    alt={`thumbnail-${index}`}
                    className={`
              w-20 h-20  rounded-xl border cursor-pointer shadow-sm 
              transition-all duration-200 hover:scale-105
              ${
                selectedImage === img.secure_url
                  ? "border-[var(--color-light-accent)] border-2"
                  : "border-gray-300"
              }
            `}
                    onClick={() => setSelectedImage(img.secure_url)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full  md:w-1/2 flex flex-col gap-3 bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
              <h1 className="text-3xl font-bold text-[var(--color-light-accent)] ">
                {data.title}
              </h1>

              <p className="text-[var(--color-light-dark)]leading-relaxed">
                {showFull
                  ? data.description
                  : data.description.split(" ").slice(0, 20).join(" ") + "..."}
                <span
                  className="text-[var(--color-light-accent)] cursor-pointer ml-1"
                  onClick={() => setShowFull(!showFull)}
                >
                  {showFull ? t("ProductDetails.showLess") : t("ProductDetails.readMore")}
                </span>
              </p>
              <div className='flex items-center gap-1 '>
                    {Array.from ({length:5}).map((_, index)=>(
                      <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={index<data.rate ?"#f59e0b" :"#d1d5db"}
                      viewBox="0 0 24 24"
                  className="w-5 h-5"
                  >
                   <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.787 1.48 8.247L12 18.896l-7.416 4.444 1.48-8.247L0 9.306l8.332-1.151z"/>
    
                  </svg>
                    ))}
                     
                     </div>
              <p className="text-xl font-semibold text-[var(--color-light-dark)]">
                {t("ProductDetails.price")}:{" "}
                <span className="  font-bold text-[var(--color-light-accent)]">
                  ${data.finalPrice}
                </span>
              </p>
                
              <p className="text-[var(--color-light-dark)] font-semibold text-lg">
                {t("ProductDetails.category")}:{" "}
                <span className="font-bold text-[var(--color-light-accent)]">
                  {data.category.name}
                </span>
              </p>

              <div className="flex items-center gap-4 mt-3">
                <button
                  className="w-10 h-10 bg-[var(--color-light-accent)] rounded-lg text-xl font-bold disabled:opacity-40"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                >
                  -
                </button>

                <span className="text-lg font-medium">{quantity}</span>

                <button
                  className="w-10 h-10 bg-[var(--color-light-accent)] rounded-lg text-xl font-bold disabled:opacity-40"
                  onClick={handleIncrease}
                  disabled={quantity >= data.stock}
                >
                  +
                </button>
              </div>

              <button className="mt-3 px-6 py-3 bg-[var(--color-light-accent)] text-[var(--color-light-dark)] text-lg font-bold rounded-xl shadow-md ">
                {t("ProductDetails.addTocart")}
              </button>
            </div>
          </div>
        </div>

        <hr className="my-10 border-t border-gray-300" />

        <h2 className="text-4xl  text-center font-bold text-[var(--color-light-accent)] mb-5 flex items-center justify-center gap-2">
          {t("ProductDetails.productReview")} <FaPaw size={28} />
        </h2>
        {showReviews && (
          <>
            <ReviewButton isOpen={() => setIsModalOpen(true)} />
            {reviewloading && <Loader />}
            {reviewError && <ErrorMessage />}
             
            {reviewdata &&
              reviewdata.length > 0 &&(
                  <ReviewCard
                    reviews={reviewdata}
                    users={userdata}
                    onDelete={(id) => deletereview.mutate(id)}
                  />
              
              )}
          </>
        )}

        <ToggleButton
          isOpen={showReviews}
          onClick={() => setShowReviews(!showReviews)}
        />

        <hr className="my-10 border-t border-gray-300" />
        <h2 className="text-4xl  text-center font-bold text-[var(--color-light-accent)] mb-6 flex items-center justify-center gap-2">
          {t("ProductDetails.relatedProduct")} <FaPaw size={28} />
        </h2>

        {relatedLoading && <Loader />}
        {relatedError && <ErrorLoader />}

        {relatedProducts && relatedProducts.length > 0 && (
          <RelatedProductsSlider relatedProducts={relatedProducts} />
        )}
        <ToastContainer />

        {isModalOpen && (
          <ReviewModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={(rate, comment) => addreview.mutate({ rate, comment })}
          />
        )}
      </div>
    </>
  );
}
