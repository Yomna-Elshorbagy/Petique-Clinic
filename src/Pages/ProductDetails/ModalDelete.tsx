import { useTranslation } from "react-i18next";

interface Props {
   isOpen:boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}
export default function ModelDelete({
  isOpen,
  message,
  onClose,
  onConfirm,
}: Props) {
  const {t}=useTranslation();
    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
      <div className="bg-[#faf7f2] p-6 rounded-xl w-80 shadow-lg">
        <p className="mb-4 text-[var(--color-extra-10)] text-md font-bold">{message}</p>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
          {t("ProductDetails.cancel")}
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={onConfirm}
          >
            {t("ProductDetails.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
