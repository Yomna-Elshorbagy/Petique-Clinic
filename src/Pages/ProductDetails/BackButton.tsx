import React from 'react'
import { Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
export default function BackButton() {
  return (
    <Link 
  to="/products"
  className="absolute top-24 left-10
  bg-white w-12 h-12 flex items-center justify-center 
  rounded-full shadow-lg hover:bg-orange-100 
  transition"
>
  <IoArrowBack className="text-orange-500 text-2xl" />
</Link>
  )
}
