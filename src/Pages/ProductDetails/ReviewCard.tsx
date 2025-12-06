import React from 'react'
import type { review, Users } from '../../Types/ProductDetailsType'
import { MdDelete } from "react-icons/md";
type Props={
   
    review:review;
    user:Users| undefined;
    onDelete:(id:string)=>void;
}
export default function ReviewCard({review,user,onDelete}:Props) {
  return (
     <div 
                 className='bg-white rounded-2xl   w-72 p-5 ml-3 shadow-md mb-4 border border-gray-200 relative '>
                   <button onClick={()=>onDelete(review._id)} className='absolute top-5 right-3 text-red-500 hover:text-red-600  z-20'>
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
                    {Array.from ({length:5}).map((_, index)=>(
                      <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={index<review.rate ?"#f59e0b" :"#d1d5db"}
                      viewBox="0 0 24 24"
                  className="w-5 h-5"
                  >
                   <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.787 1.48 8.247L12 18.896l-7.416 4.444 1.48-8.247L0 9.306l8.332-1.151z"/>
    
                  </svg>
                    ))}
                     
                     </div>
                  
                  <p className='text-gray-700 leading-relaxed'>{review.comment}</p>
    
    
                  </div>
  )
}
