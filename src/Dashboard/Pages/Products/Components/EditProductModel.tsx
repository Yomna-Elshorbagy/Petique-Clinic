import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaEdit,
  FaImage,
  FaTag,
  FaDollarSign,
  FaBoxOpen,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { z } from "zod";
import type { IProduct } from "../../../../Interfaces/IProducts";
import { getAllCategories } from "../../../../Apis/CategoryApis";
import { updateProduct } from "../../../../Apis/ProductsDashboard";

const editProductSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(3).optional(),
  price: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().positive().optional()
  ),
  discount: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().min(0).max(100).optional()
  ),
  stock: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().int().min(0).optional()
  ),
  category: z.string().optional(),
  imageCover: z.any().optional(),
  subImages: z.any().optional(),
});

interface Props {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const EditProductModal: React.FC<Props> = ({
  product,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
  });

  const [imageCover, setImageCover] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<FileList | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ===> load categories
  useEffect(() => {
    const fetch = async () => {
      const c = await getAllCategories();
      setCategories(c || []);
    };
    fetch();
  }, []);

  // ===> load product into form
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        discount: product.discount?.toString() || "",
        stock: product.stock.toString(),
        category: product.category?._id || "",
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    const validation = editProductSchema.safeParse(formData);
    if (!validation.success) {
      setValidationErrors(validation.error.issues.map((i) => i.message));
      return;
    }

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([k, v]) => v && fd.append(k, v));
      if (imageCover) fd.append("imageCover", imageCover);
      if (subImages)
        Array.from(subImages).forEach((file) => fd.append("subImages", file));

      await updateProduct(product._id, fd);

      Swal.fire("Updated!", "Product updated successfully!", "success");
      onUpdated();
      onClose();
    } catch (err: any) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="
        relative w-full max-w-3xl max-h-[92vh] overflow-y-auto 
        rounded-2xl shadow-xl animate-slideUp 
        bg-[var(--color-light-background)] 
        border border-[var(--color-light-secondary)]/40
        "
      >
        {/* HEADER */}
        <div
          className="
          flex justify-between items-center 
          px-6 py-4 rounded-t-2xl
          bg-[var(--color-light-primary)]
          text-[var(--color-light-dark)]
          border-b border-[var(--color-light-secondary)]/40
          "
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaEdit /> Edit Product
          </h2>

          <button
            onClick={onClose}
            className="hover:text-[var(--color-light-accent)] transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {validationErrors.length > 0 && (
            <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded-md animate-fadeIn">
              <ul className="space-y-1 list-disc pl-5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ==> title */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FaTag /> Title
            </label>
            <input
              className="input-box"
              name="title"
              value={formData.title}
              onChange={handleInput}
            />
          </div>

          {/* ==> description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="input-box"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInput}
            />
          </div>

          {/* ===> price + discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium flex gap-2 items-center">
                <FaDollarSign /> Price (EGP)
              </label>
              <input
                className="input-box"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInput}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Discount (%)</label>
              <input
                type="number"
                className="input-box"
                name="discount"
                value={formData.discount}
                onChange={handleInput}
              />
            </div>
          </div>

          {/* ==> stock + category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Stock</label>
              <input
                type="number"
                className="input-box"
                name="stock"
                value={formData.stock}
                onChange={handleInput}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium flex items-center gap-2">
                <FaBoxOpen /> Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleInput}
                className="input-box"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ===> cover image */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FaImage /> Cover Image
            </label>
            <input
              type="file"
              className="block"
              onChange={(e) => setImageCover(e.target.files?.[0] || null)}
            />
          </div>

          {/* ===> sub images */}
          <div>
            <label className="block mb-1 font-medium">Sub Images</label>
            <input
              type="file"
              className="block"
              multiple
              onChange={(e) => setSubImages(e.target.files)}
            />
          </div>

          {/* buttons */}
          <div className="flex justify-end gap-3 pt-5 border-t border-[var(--color-light-secondary)]/40">
            <button
              type="button"
              onClick={onClose}
              className="
              px-4 py-2 rounded-lg 
              bg-[var(--color-extra-3)] text-[var(--color-light-dark)]
              hover:bg-[var(--color-light-secondary)] transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-4 py-2 rounded-lg text-white
                bg-[var(--color-light-accent)]
                hover:bg-[var(--color-light-secondary)]
                transition-all duration-300 shadow-md
              "
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
