import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { useTranslation } from 'react-i18next';
import {  MdAdd } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
type Props={
    isOpen:()=>void;
}
interface JwtPayload {
  role?: "admin" | "doctor" | "owner" | "petOwner";
   id: string;
   iat: number;
  exp: number;
}
export default function ReviewButton({isOpen}:Props) {
  const {t,i18n} = useTranslation();
   const isRtl = i18n.language === "ar"
    const token = localStorage.getItem("accessToken");
     const navigate = useNavigate();
    let role: JwtPayload["role"] | null = null;
    
    if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          role = decoded.role;
        } catch (error) {
          console.error("Invalid token", error);
        }
      }
    
    const isPrivilegedRole =
        role === "admin" || role === "doctor" ;

      const handleClick = () => {
        if(!token){
          Swal.fire({
                icon: "warning",
                title:  t("ProductDetails.loginRequiredTitle"),
                text: t("ProductDetails.loginRequiredText"), 
                showCancelButton: true,
                confirmButtonText: t("ProductDetails.login"), 
                cancelButtonText: t("ProductDetails.continueShopping"), 
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/login");
                }
              });
              return;
        }
        isOpen();
      }
  return (
    <div className='flex justify-end mb-2'>
            <button className={`flex items-center gap-2  rounded-2xl shadow-md bg-[var(--color-light-accent)] text-[var(--color-light-dark)] px-4 py-2 hover:bg-[var(--color-accent-dark)] hover:text-white  ${isRtl ? 'ml-3' : 'mr-3'}`} onClick={handleClick}
            disabled={isPrivilegedRole}
              >
               <MdAdd className="text-2xl " />
              <span className=' text-lg font-bold'>{isPrivilegedRole ?  t("ProductDetails.notallowed") :t("ProductDetails.addReview")}</span>
            </button>
            </div>
  )
}
