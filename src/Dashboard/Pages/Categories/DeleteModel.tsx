
import React from 'react'
interface Props{
    title:string;
    message:string;
    onClose:()=>void;
    onConfirm:()=>void;
}
export default function DeleteModel({ title,message,onClose,onConfirm}:Props) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="bg-[#faf7f2] p-6 rounded-xl w-80 shadow-lg">
            <h3 className="text-lg font-bold text-red-600 mb-4">{title}</h3>
            <p className="mb-6 text-gray-700 text-sm">
             {message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
  )
}
