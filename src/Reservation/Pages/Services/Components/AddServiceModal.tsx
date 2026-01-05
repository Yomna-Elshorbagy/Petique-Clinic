import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaTimes, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddService } from "../../../../Hooks/Services/UseServices";
import { useQueryClient } from "@tanstack/react-query";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Schema
const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priceRange: z
    .number({ message: "Price must be a number" })
    .min(0, { message: "Price must be >= 0" }),
  preparations: z.string().optional(),
  benefits: z.string().optional(),
  tips: z.string().optional(),
  duration: z.string().optional(),
  image: z
    .instanceof(File, { message: "Main image is required" })
    .refine((file) => file.size > 0, { message: "Image cannot be empty" }),
  subImages: z.any().optional(),
  category: z.enum(
    ["Consultations", "Preventive Care", "Hygiene", "Dental Care"],
    {
      message: "Please select a valid category",
    }
  ),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function AddServiceModal({
  isOpen,
  onClose,
}: AddServiceModalProps) {
  const addService = useAddService();
  const [preview, setPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      priceRange: undefined,
      preparations: "",
      benefits: "",
      tips: "",
      duration: "",
      image: undefined,
      subImages: undefined,
      category: "Consultations",
    },
  });

  const watchedImage = watch("image");

  useEffect(() => {
    if (watchedImage) {
      setPreview(URL.createObjectURL(watchedImage));
    } else {
      setPreview(null);
    }
  }, [watchedImage]);

  const onSubmit = (data: ServiceFormData) => {
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("description", data.description || "");
    fd.append("priceRange", data.priceRange.toString());
    fd.append("preparations", data.preparations || "");
    fd.append("benefits", data.benefits || "");
    fd.append("duration", data.duration || "");
    fd.append("tips", data.tips || "");
    fd.append("category", data.category);
    fd.append("image", data.image);

    if (data.subImages) {
      Array.from(data.subImages as FileList).forEach((file) =>
        fd.append("subImages", file)
      );
    }

    addService.mutate(fd, {
      onSuccess: () => {
        Swal.fire("Success", "Service added successfully!", "success");
        reset();
        setPreview(null);
        queryClient.invalidateQueries({ queryKey: ["services"] });
        onClose();
      },
      onError: (error: unknown) => {
        const e = error as { response?: { data?: { message?: string } } };
        Swal.fire(
          "Error",
          e.response?.data?.message || "Something went wrong",
          "error"
        );
      },
    });
  };

  if (!isOpen) return null;

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
          <h2 className="text-3xl font-bold text-[#86654F]">Add New Service</h2>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-8 pt-4 pb-8 overflow-y-auto space-y-6"
        >
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
                  Upload Main Image
                </span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setValue("image", file, { shouldValidate: true });
              }}
            />
          </label>
          {errors.image && (
            <span className="text-red-500 text-xs">{errors.image.message}</span>
          )}

          {/* Title */}
          <div>
            <label className="font-semibold text-sm text-[#86654F]">
              Service Title
            </label>
            <input
              className="w-full p-4 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-red-500 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Price Range */}
          <div>
            <label className="font-semibold text-sm text-[#86654F]">
              Price Range
            </label>
            <input
              type="number"
              min={0}
              className="w-full p-4 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
              {...register("priceRange", { valueAsNumber: true })}
            />
            {errors.priceRange && (
              <span className="text-red-500 text-xs">
                {errors.priceRange.message}
              </span>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold text-sm text-[#86654F]">
              Category
            </label>
            <select
              className="w-full p-4 rounded-xl bg-[#FCF9F4] border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
              {...register("category")}
            >
              <option value="Consultations">Consultations</option>
              <option value="Preventive Care">Preventive Care</option>
              <option value="Hygiene">Hygiene</option>
              <option value="Dental Care">Dental Care</option>
            </select>
            {errors.category && (
              <span className="text-red-500 text-xs">
                {errors.category.message}
              </span>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="font-semibold text-sm text-[#86654F]">
              Duration
            </label>
            <input
              className="w-full p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
              placeholder="e.g., 30 mins"
              {...register("duration")}
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-sm text-[#86654F]">
              Description
            </label>
            <textarea
              className="w-full p-4 bg-[#FCF9F4] rounded-xl h-28 resize-none border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none transition-all text-[#6D5240]"
              {...register("description")}
            />
          </div>

          {/* Preparations / Benefits / Tips */}
          <div className="grid grid-cols-3 gap-4">
            <textarea
              className="p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
              placeholder="Preparations"
              {...register("preparations")}
            />
            <textarea
              className="p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
              placeholder="Benefits"
              {...register("benefits")}
            />
            <textarea
              className="p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
              placeholder="Tips"
              {...register("tips")}
            />
          </div>

          {/* Sub Images */}
          <div>
            <label className="font-semibold text-sm text-[#86654F]">
              Sub Images
            </label>
            <input
              type="file"
              multiple
              className="w-full p-3 bg-[#FCF9F4] rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#A98770] file:text-white hover:file:bg-[#86654F]"
              onChange={(e) => setValue("subImages", e.target.files)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#86654F] text-white py-4 rounded-xl font-bold hover:bg-[#6d5240] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {addService.isPending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Create Service"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
