import React from 'react'
import { MdErrorOutline } from 'react-icons/md';
export default function ErrorMessage() {
  return (
    <div className='flex flex-col justify-center items-center p-4'>
            <MdErrorOutline size={50} className='text-red-500' />
            <p className='text-red-600 mt-2'>Failed to load Reviews. Please refresh.</p>
          </div>
  );
}
