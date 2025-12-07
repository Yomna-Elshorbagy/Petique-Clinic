import React, { useState } from "react";
import {
  FaTimes,
  FaInfoCircle,
  FaBoxOpen,
  FaUser,
  FaImage,
} from "react-icons/fa";
import type { IProduct } from "../../../../Interfaces/IProducts";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: IProduct | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  product,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="
          relative w-full max-w-2xl max-h-[90vh] overflow-y-auto 
          bg-[var(--color-light-background)]
          border border-[var(--color-light-secondary)]/40
          rounded-2xl shadow-xl animate-fadeIn
        "
      >
        {/* Header */}
        <div
          className="
            flex justify-between items-center 
            bg-[var(--color-light-primary)] 
            text-[var(--color-light-dark)]
            px-6 py-4 rounded-t-2xl border-b border-[var(--color-light-secondary)]/40
          "
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaInfoCircle /> Product Details
          </h2>
          <button
            onClick={onClose}
            className="hover:text-[var(--color-light-accent)] transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-[var(--color-light-dark)]">
          {/* BASIC INFO */}
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-[var(--color-light-accent)]">
              <FaInfoCircle /> Basic Information
            </h3>

            <div
              className="
                mt-3 border border-[var(--color-light-secondary)]/40 rounded-xl p-4
                bg-[var(--color-extra-5)]
              "
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <p><strong>ID:</strong> {product._id}</p>
                <p><strong>Title:</strong> {product.title}</p>

                <p className="col-span-2">
                  <strong>Description:</strong> {product.description}
                </p>

                <p>
                  <strong>Price:</strong>{" "}
                  <span className="text-green-700 font-semibold">
                    {product.price} EGP
                  </span>
                </p>

                <p>
                  <strong>Discount:</strong>{" "}
                  {product.discount ? `${product.discount}%` : "—"}
                </p>

                <p>
                  <strong>Final Price:</strong> {product.finalPrice}
                </p>

                <p>
                  <strong>Stock:</strong> {product.stock}
                </p>

                <p>
                  <strong>Rating:</strong> ⭐ {product.rate}
                </p>
              </div>
            </div>
          </section>

          {/* CATEGORY */}
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-[var(--color-light-accent)]">
              <FaBoxOpen /> Category Info
            </h3>

            <div
              className="
                flex gap-4 items-center border border-[var(--color-light-secondary)]/40 
                rounded-xl p-4 bg-[var(--color-extra-3)]
              "
            >
              <img
                src={product.category?.image?.secure_url}
                className="w-16 h-16 rounded-lg object-cover border"
                alt={product.category?.name}
              />

              <div>
                <p><strong>Name:</strong> {product.category?.name}</p>
                <p><strong>ID:</strong> {product.category?._id}</p>
              </div>
            </div>
          </section>

          {/* SELLER */}
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-[var(--color-light-accent)]">
              <FaUser /> Seller Information
            </h3>

            <div
              className="
                mt-3 border border-[var(--color-light-secondary)]/40 rounded-xl p-4
                bg-[var(--color-extra-5)]
              "
            >
              <p><strong>Name:</strong> {product.createdBy?.userName}</p>
              <p><strong>Phone:</strong> {product.createdBy?.mobileNumber}</p>
              <p><strong>Address:</strong> {product.createdBy?.address || "Not Provided"}</p>
            </div>
          </section>

          {/* IMAGES */}
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-[var(--color-light-accent)]">
              <FaImage /> Images
            </h3>

            <div className="mt-3 flex flex-wrap gap-3">
              {[product.imageCover, ...(product.subImages || [])].map(
                (img, i) => (
                  <img
                    key={i}
                    src={img.secure_url}
                    onClick={() => setSelectedImage(img.secure_url)}
                    className="
                      w-24 h-24 object-cover rounded-lg border cursor-pointer 
                      hover:scale-105 hover:border-[var(--color-light-accent)] transition
                    "
                  />
                )
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className="
            flex justify-end p-4 border-t border-[var(--color-light-secondary)]/40 
            bg-[var(--color-extra-5)]
          "
        >
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg text-white 
              bg-[var(--color-light-accent)] hover:bg-[var(--color-light-secondary)]
              transition-all duration-300 shadow-md
            "
          >
            Close
          </button>
        </div>
      </div>

      {/* IMAGE PREVIEW OVERLAY */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-w-3xl max-h-[85vh] rounded-xl border shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default ProductModal;
