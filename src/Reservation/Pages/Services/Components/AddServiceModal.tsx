import { useState } from "react";
import Swal from "sweetalert2";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { useAddService } from "../../../../Hooks/Services/UseServices";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
  const addService = useAddService();

  const [form, setForm] = useState<{
    title: string;
    description: string;
    priceRange: string;
    preparations: string;
    benefits: string;
    tips: string;
    image: File | null;
    subImages: FileList | null;
  }>({
    title: "",
    description: "",
    priceRange: "",
    preparations: "",
    benefits: "",
    tips: "",
    image: null,
    subImages: null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, image: e.target.files[0] });
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.priceRange || !form.image) {
      Swal.fire("Error", "Please fill in all required fields and upload a main image.", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("priceRange", form.priceRange);
    fd.append("preparations", form.preparations);
    fd.append("benefits", form.benefits);
    fd.append("tips", form.tips);

    if (form.image) fd.append("image", form.image);

    if (form.subImages) {
      Array.from(form.subImages).forEach((file) => {
        fd.append("subImages", file);
      });
    }

    addService.mutate(fd, {
      onSuccess: () => {
        setForm({
          title: "",
          description: "",
          priceRange: "",
          preparations: "",
          benefits: "",
          tips: "",
          image: null,
          subImages: null,
        });
        setPreview(null);
        onClose();
        Swal.fire("Success", "Service added successfully!", "success");
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative my-auto animate-fade-in flex flex-col max-h-[90vh]">

        {/* ===> header Section */}
        <div className="p-8 pb-0 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <FaTimes size={24} />
          </button>
          <h2 className="text-3xl font-bold mb-4 text-[#86654F]">Add New Service</h2>
        </div>

        {/* ===> scrollable Content Section */}
        <div className="p-8 pt-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div className="relative group">
              <label className="block w-full h-48 rounded-2xl border-2 border-dashed border-[#E5A46C] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FCF9F4] transition-colors bg-gray-50 overflow-hidden shrink-0">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-4xl text-[#E5A46C] mb-2" />
                    <span className="text-[#86654F] font-medium">Upload Main Image</span>
                  </>
                )}
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Title</label>
                <input
                  className="w-full p-4 bg-[#FCF9F4] border-none rounded-xl focus:ring-2 focus:ring-[#E5A46C] transition-all"
                  placeholder="e.g. General Checkup"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                <input
                  className="w-full p-4 bg-[#FCF9F4] border-none rounded-xl focus:ring-2 focus:ring-[#E5A46C] transition-all"
                  placeholder="e.g. $50 - $100"
                  value={form.priceRange}
                  onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
                />
              </div>

              {/* ===> sub Images Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Images</label>
                <input
                  type="file"
                  multiple
                  className="w-full p-3 bg-[#FCF9F4] border-none rounded-xl focus:ring-2 focus:ring-[#E5A46C] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E5A46C] file:text-white hover:file:bg-[#d6905a]"
                  onChange={(e) => setForm({ ...form, subImages: e.target.files })}
                  accept="image/*"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full p-4 bg-[#FCF9F4] border-none rounded-xl focus:ring-2 focus:ring-[#E5A46C] transition-all h-32 resize-none"
                placeholder="Detailed description of the service..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preparations</label>
                <textarea
                  className="w-full p-3 bg-[#FCF9F4] border-none rounded-xl focus:ring-2 focus:ring-[#E5A46C] transition-all h-24 resize-none text-sm"
                  placeholder="Fasting required..."
                  value={form.preparations}
                  onChange={(e) => setForm({ ...form, preparations: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Benefits</label>
                <textarea
                  className="w-full p-3 bg-[#FCF9F4] border-none rounded-xl focus:ring-2 focus:ring-[#E5A46C] transition-all h-24 resize-none text-sm"
                  placeholder="Improves health..."
                  value={form.benefits}
                  onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tips</label>
                <textarea
                  className="w-full p-3 bg-[#FCF9F4] border-none rounded-xl focus:ring-2 focus:ring-[#E5A46C] transition-all h-24 resize-none text-sm"
                  placeholder="Bring records..."
                  value={form.tips}
                  onChange={(e) => setForm({ ...form, tips: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 pb-2">
              <button
                className="w-full md:w-auto px-8 py-4 bg-[#86654F] text-white rounded-xl font-semibold hover:bg-[#6d5240] transition-colors shadow-lg hover:shadow-xl active:scale-95 transform"
                onClick={handleSubmit}
                disabled={addService.isPending}
              >
                {addService.isPending ? "Adding Service..." : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
