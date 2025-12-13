import { useEffect, useState } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  useService,
  useUpdateService,
} from "../../../../Hooks/Services/UseServices";

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

export default function EditServiceModal({
  isOpen,
  onClose,
  serviceId,
}: EditServiceModalProps) {
  const { data, isLoading } = useService(serviceId || "");
  const updateService = useUpdateService(serviceId || "");
  interface ServiceForm {
    title: string;
    description: string;
    priceRange: string;
    preparations: string;
    benefits: string;
    tips: string;
    duration: string;
    image: File | null;
    subImages: FileList | null;
  }

  const [form, setForm] = useState<ServiceForm>({
    title: "",
    description: "",
    priceRange: "",
    preparations: "",
    benefits: "",
    tips: "",
    duration: "",
    image: null,
    subImages: null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const s: any = data;

      setForm({
        title: s.title || "",
        description: s.description || "",
        priceRange: s.priceRange || "",
        preparations: s.preparations || "",
        benefits: s.benefits || "",
        tips: s.tips || "",
        duration: s.duration || "",
        image: null,
        subImages: null,
      });

      setPreview(s.image?.secure_url || s.image?.url || null);
    }
  }, [data]);

  if (!isOpen) return null;

  const handleImageChange = (e: any) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, image: e.target.files[0] });
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    if (!serviceId) {
      Swal.fire("Error", "No service selected to update", "error");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]: any) => {
      if (value && key !== "subImages") fd.append(key, value);
    });
    if (form.subImages && form.subImages.length > 0) {
      Array.from(form.subImages).forEach((file) => {
        fd.append("subImages", file);
      });
    }

    updateService.mutate(fd, {
      onSuccess: () => {
        Swal.fire("Success", "Service updated!", "success");
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#FCF9F4] rounded-3xl w-full max-w-2xl shadow-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 relative bg-[#ECE7E2]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#86654F] hover:text-[#6d5240] transition-colors"
          >
            <FaTimes size={24} />
          </button>
          <h2 className="text-3xl font-bold text-[#86654F]">Edit Service</h2>
        </div>

        {/* Content */}
        <div className="px-8 pt-4 pb-8 overflow-y-auto space-y-6">
          {isLoading ? (
            <p className="text-center py-6 text-[#86654F] font-medium">
              Loading...
            </p>
          ) : (
            <>
              {/* Main Image */}
              <label className="block w-full h-48 border-2 border-dashed border-[#A98770] rounded-2xl bg-[#FCF9F4] flex flex-col justify-center items-center cursor-pointer hover:bg-[#F5F0EC] transition-colors">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-4xl text-[#A98770]" />
                    <span className="mt-2 text-[#86654F] font-medium">
                      Upload New Image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              {/* Title */}
              <div>
                <label className="font-semibold text-sm text-[#86654F]">
                  Service Title
                </label>
                <input
                  className="w-full p-4  bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Price & SubImages */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm text-[#86654F]">
                    Price Range
                  </label>
                  <input
                    className="w-full p-4  bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                    value={form.priceRange}
                    onChange={(e) =>
                      setForm({ ...form, priceRange: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-sm text-[#86654F]">
                    Sub Images
                  </label>
                  <input
                    type="file"
                    multiple
                    className="w-full p-3 bg-[#FCF9F4] rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#A98770] file:text-white hover:file:bg-[#86654F]"
                    onChange={(e) =>
                      setForm({ ...form, subImages: e.target.files })
                    }
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="font-semibold text-sm text-[#86654F]">
                  Duration
                </label>
                <input
                  className="w-full p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  placeholder="e.g., 30 mins"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-sm text-[#86654F]">
                  Description
                </label>
                <textarea
                  className="w-full p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* Preparations / Benefits / Tips */}
              <div className="grid grid-cols-3 gap-4">
                <textarea
                  className="p-4  bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                  placeholder="Preparations"
                  value={form.preparations}
                  onChange={(e) =>
                    setForm({ ...form, preparations: e.target.value })
                  }
                />
                <textarea
                  className="p-4  bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                  placeholder="Benefits"
                  value={form.benefits}
                  onChange={(e) =>
                    setForm({ ...form, benefits: e.target.value })
                  }
                />
                <textarea
                  className="p-4  bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
                  placeholder="Tips"
                  value={form.tips}
                  onChange={(e) => setForm({ ...form, tips: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-[#86654F] text-white py-4 rounded-xl font-bold hover:bg-[#6d5240] transition-colors shadow-sm"
              >
                Update Service
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
