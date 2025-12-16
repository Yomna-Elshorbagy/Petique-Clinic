import React from 'react'
import { useTranslation } from 'react-i18next';
import {  MdAdd } from "react-icons/md";
type Props={
    isOpen:()=>void;
}
export default function ReviewButton({isOpen}:Props) {
  const {t,i18n} = useTranslation();
   const isRtl = i18n.language === "ar"
  return (
    <div className='flex justify-end mb-2'>
            <button className={`flex items-center gap-2  rounded-2xl shadow-md bg-[var(--color-light-accent)] text-[var(--color-light-dark)] px-4 py-2   ${isRtl ? 'ml-3' : 'mr-3'}`} onClick={isOpen}>
               <MdAdd className="text-2xl " />
              <span className=' text-lg font-bold'>{t("ProductDetails.addReview")}</span>
            </button>
            </div>
  )
}
