import { Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
export default function BackButton() {
  return (
    <Link 
  to="/products"
  className="absolute top-2 left-10
  bg-[var(--color-bg-light)] w-12 h-12 flex items-center justify-center 
  rounded-full shadow-lg 
  transition"
>
  <IoArrowBack className="text-[var(--color-light-accent)] text-2xl" />
</Link>
  )
}
