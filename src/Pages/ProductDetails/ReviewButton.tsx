import React from 'react'
import {  MdAdd } from "react-icons/md";
type Props={
    isOpen:()=>void;
}
export default function ReviewButton({isOpen}:Props) {
  return (
    <div className='flex justify-end mb-2'>
            <button className='flex items-center gap-2 mr-3 rounded-2xl shadow-md bg-[var(--color-light-accent)] text-[var(--color-light-dark)] px-4 py-2 ' onClick={isOpen}>
               <MdAdd className="text-2xl " />
              <span className=' text-lg font-bold'>Add Review</span>
            </button>
            </div>
  )
}
