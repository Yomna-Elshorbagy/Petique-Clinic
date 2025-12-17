import { FaEdit, FaPlusCircle, FaTimes } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
interface Props {
  onClose: () => void;
  updateId: string | null;
  categoryName: string;
  setCategoryName: (val: string) => void;
  categoryImage: File | null;
  setCategoryImage: (file: File | null) => void;
  previewImageUrl: string | null;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  loading: boolean;
}
export default function CategoryModal({
  onClose,
  updateId,
  categoryName,
  setCategoryName,
  categoryImage,
  setCategoryImage,
  previewImageUrl,
  errorMessage,
  setErrorMessage,
  onAdd,
  onUpdate,
  loading,
}: Props) {
  return (
    <div className=" fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4">
      <div className=" bg-[var(--color-light-background)] shadow-xl animate-fadeIn 
      border border-[var(--color-light-secondary)]/40
      rounded-2xl w-96  relative overflow-y-auto">

        <div
          className="
                   flex justify-between items-center px-3 py-3
                   bg-[var(--color-light-primary)] text-[var(--color-light-dark)]
                   rounded-t-2xl border-b border-[var(--color-light-secondary)]/40
                   
                 "
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {updateId ?
              (<> <FaEdit /> Update Category </>) : (
                <>
                  <FaPlusCircle />  Add New Category
                </>
              )}

          </h2>
          <button onClick={onClose} className="hover:text-[var(--color-light-accent)] transition">
            <FaTimes size={18} />
          </button>
        </div>




        <div className="px-3 pb-2 pt-3 ">
          <div className="flex  flex-col items-center mb-3 ">
            <label
              htmlFor="categoryImage"
              className="cursor-pointer flex flex-col items-center"
            >
              <div
                className="w-28 h-28 rounded-full bg-gray-100 border border-[#d0c6b8]
      shadow-sm flex items-center justify-center overflow-hidden
      hover:shadow-md "
              >
                {categoryImage ? (
                  <img
                    src={URL.createObjectURL(categoryImage)}
                    alt="category"
                    className="w-full h-full object-cover"
                  />
                ) : previewImageUrl ? (
                  <img
                    src={previewImageUrl}
                    alt="category"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center font-bold text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                      className="w-8 h-8 opacity-70 mb-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 6.75L10.5 5h3L15 6.75h2.25A2.25 2.25 0 0119.5 9v7.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 16.5V9A2.25 2.25 0 016.75 6.75H9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15.75a3 3 0 100-6 3 3 0 000 6z"
                      />
                    </svg>
                    <span className="text-xs">Upload</span>
                  </div>
                )}
              </div>

              <input
                id="categoryImage"
                type="file"
                accept="images/*"
                onChange={(e) => {
                  setCategoryImage(e.target.files?.[0] || null);
                  if (errorMessage) setErrorMessage("");
                }}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            className="w-full border border-[var(--color-light-secondary)]/40 p-2 mb-3 rounded-xl bg-[var(--color-extra-5)] focus:ring-2 focus:ring-[var(--color-light-accent)] outline-none transition"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
          )}
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2  rounded-xl bg-[var(--color-extra-3)] hover:bg-[var(--color-extra-2)] transition-all duration-3 " onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-4 py-2  bg-[var(--color-light-accent)] text-white rounded-xl hover:bg-[var(--color-light-secondary)] transition-all duration-300"
              onClick={updateId ? onUpdate : onAdd}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : updateId ? (
                "Update Category"
              ) : (
                "Add Category"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
