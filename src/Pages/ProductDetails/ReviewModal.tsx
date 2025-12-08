import React , { useState } from 'react';
import { MdClose } from "react-icons/md";
type Props={
    
    onClose:()=> void;
    onSubmit:(rate:number,comment:string)=>void;

}

export default function ReviewModal({onClose,onSubmit}:Props) {
    const [rate, setRate] = useState(0);
      const [hoverRate, setHoverRate] = useState(0);
      const [comment, setComment] = useState("");
      const [commentError, setCommentError] = useState("");
      const [rateError, setRateError] = useState("");
 
    

      const handleAddReview=()=>{
      let hasError = false;
      if(rate === 0){
        setRateError("Please select a rating!");
         hasError = true;
      };
      if (!comment.trim()) {
    setCommentError("Please write a comment!");
     hasError = true;
  };
    if (hasError) return;
     onSubmit(rate,comment);
    
      onClose();
     };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl w-96 p-6 relative shadow-lg">
              {/* <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
                <MdClose className="text-2xl" />
              </button> */}
              <h2 className="text-2xl font-bold text-orange-400 mb-4">Add New Review</h2>

              <label className="block font-semibold mb-2 text-gray-700">Rating</label>
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill={star <= (hoverRate || rate) ? "#f59e0b" : "#d1d5db"}
                    className="w-8 h-8 cursor-pointer transition-colors"
                    onClick={() => {setRate(star);
                       setRateError("");
                    }}
                    onMouseEnter={() => setHoverRate(star)}
                    onMouseLeave={() => setHoverRate(0)}
                  >
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.787 1.48 8.247L12 18.896l-7.416 4.444 1.48-8.247L0 9.306l8.332-1.151z" />
                  </svg>
                ))}
              </div>
                {rateError && <p className="text-red-500 text-sm mb-2">{rateError}</p>}
              <label className="block font-semibold mb-2 text-gray-700">Comment</label>
              <textarea value={comment} onChange={(e) => {setComment(e.target.value);  if (e.target.value.trim()) setCommentError("")}}
                className="w-full h-24 p-2 border rounded-lg resize-none focus:outline-none  focus:ring-0 border-orange-400 mb-4"
                placeholder="Write your review here..."
              />
                 {commentError && <p className="text-red-500 text-sm mb-2">{commentError}</p>}
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition" onClick={onClose}>Cancel</button>
                <button className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition" onClick={handleAddReview}>Submit</button>
              </div>
            </div>
          </div>
  )
}
