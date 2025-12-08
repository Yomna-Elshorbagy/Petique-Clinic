import React from 'react'
import { ClipLoader } from "react-spinners";
interface Props{
    
  onClose: () => void;
  updateId: string | null;
  categoryName: string;
  setCategoryName: (val: string) => void;
  categoryImage: File | null;
  setCategoryImage: (file: File | null) => void;
  previewImageUrl: string | null;
   errorMessage: string;
  setErrorMessage: (msg: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  loading: boolean;
}
export default function CategoryModal({

  onClose,
  updateId,
  categoryName,
  setCategoryName,
  categoryImage,
  setCategoryImage,
  previewImageUrl,
  errorMessage,
  setErrorMessage,
  onAdd,
  onUpdate,
  loading,
}:Props) {
  
  return (
   <div className=' fixed inset-0 z-50 flex justify-center items-center bg-black/50'>
       <div className='bg-[#faf7f2] p-6 rounded-xl w-96 relative'>
        <h2 className='text-xl font-bold mb-4 text-[#86654f]'>{updateId ? 'Update Category' : 'Add New Category'}</h2>
        
       <div className='flex  flex-col items-center mb-4'>
        <label htmlFor='categoryImage' className='cursor-pointer flex flex-col items-center'>
         <div className='w-28 h-28 rounded-full bg-gray-100 border border-[#d0c6b8]
      shadow-sm flex items-center justify-center overflow-hidden
      hover:shadow-md '>
           {categoryImage ?(<img
                src={URL.createObjectURL(categoryImage)}
                alt="category"
                className="w-full h-full object-cover"
              />) :previewImageUrl? (<img
      src={previewImageUrl}
      alt="category"
      className="w-full h-full object-cover"
    />) :
              ( <div className="flex flex-col items-center font-bold text-gray-500">
       <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.7}
  stroke="currentColor"
  className="w-8 h-8 opacity-70 mb-1"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M9 6.75L10.5 5h3L15 6.75h2.25A2.25 2.25 0 0119.5 9v7.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 16.5V9A2.25 2.25 0 016.75 6.75H9z"
  />
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 15.75a3 3 0 100-6 3 3 0 000 6z"
  />
</svg>
          <span className="text-xs">Upload</span>
        </div>)}
         </div>
         
       <input
         id="categoryImage"
        type='file'
        accept='images/*'
        onChange={(e)=>{setCategoryImage(e.target.files?.[0] || null)
            if (errorMessage) setErrorMessage("");
        }}
        className='hidden'
        />

        </label>

       </div>
        
        
        <input type='text'
        placeholder='Category Name'
        value={categoryName}
        onChange={(e)=>{setCategoryName(e.target.value)
            if (errorMessage) setErrorMessage("");
        }}
        className='w-full border-2 p-2 mb-4 rounded border-[#86654f] focus:outline-none focus:ring-0'
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mb-3">{errorMessage}</p>

        )}
        <div className='flex justify-end gap-3'>
        <button className='px-4 py-2 bg-gray-200 rounded '
        onClick={onClose}
        >
         Cancel
        </button>
        <button className='px-4 py-2 bg-[#86654f] text-white rounded'
        onClick={updateId? onUpdate :onAdd}
        disabled={loading}
        >
         {loading ?  <ClipLoader color="#ffffff" size={20} /> :(updateId? "Update":"Add") }
         
        </button>
        </div>
       </div>
      </div>
  )
}
