import React, { useEffect, useState } from "react";
import { FaTimes, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useService,
  useUpdateService,
} from "../../../../Hooks/Services/UseServices";
import type { IService } from "../../../../Interfaces/IService";

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}
// Schema
const editServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priceRange: z
    .number({ message: "Price is required" })
    .min(0, { message: "Price must be >= 0" }),
  preparations: z.string().optional(),
  benefits: z.string().optional(),
  tips: z.string().optional(),
  duration: z.string().optional(),
  image: z.instanceof(File).optional(),
  subImages: z.array(z.instanceof(File))
.optional(),
});

type EditServiceFormData = z.infer<typeof editServiceSchema>;

export default function EditServiceModal({
  isOpen,
  onClose,
  serviceId,
}: EditServiceModalProps) {
  const { data, isLoading } = useService(serviceId || "");
  const updateService = useUpdateService(serviceId || "");

  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditServiceFormData>({
    resolver: zodResolver(editServiceSchema),
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
    },
  });

  const watchedImage = watch("image");

  useEffect(() => {
    if (data) {
      const s: IService = data;
      reset({
        title: s.title || "",
        description: s.description || "",
        priceRange: s.priceRange ? Number(s.priceRange) : undefined,
        preparations: s.preparations || "",
        benefits: s.benefits || "",
        tips: s.tips || "",
        // duration: (s as any).duration ?? "",
        image: undefined,
        subImages: undefined,
      });
      
      const imgUrl =
        (s.image as { secure_url?: string; url?: string } | undefined)
          ?.secure_url ||
        (s.image as { secure_url?: string; url?: string } | undefined)?.url ||
        null;

      setPreview(imgUrl);
    }
  }, [data, reset]);

  useEffect(() => {
    if (watchedImage) {
      setPreview(URL.createObjectURL(watchedImage));
    }
  }, [watchedImage]);

  const onSubmit = (data: EditServiceFormData) => {
    if (!serviceId) {
      Swal.fire("Error", "No service selected to update", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("description", data.description || "");
    fd.append("priceRange", data.priceRange?.toString() || "0");
    fd.append("preparations", data.preparations || "");
    fd.append("benefits", data.benefits || "");
    fd.append("tips", data.tips || "");
    fd.append("duration", data.duration || "");
    if (data.image) fd.append("image", data.image);
    if (data.subImages) {
      data.subImages.forEach((file) => fd.append("subImages", file));
    }

    updateService.mutate(fd, {
      onSuccess: () => {
        Swal.fire("Success", "Service updated!", "success");
        reset();
        setPreview(null);
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
          <h2 className="text-3xl font-bold text-[#86654F]">Edit Service</h2>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-8 pt-4 pb-8 overflow-y-auto space-y-6"
        >
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
                  onChange={(e) =>
                    setValue("image", e.target.files?.[0], {
                      shouldValidate: true,
                    })
                  }
                />
              </label>
              {errors.image && (
                <span className="text-red-500 text-xs">
                  {errors.image.message}
                </span>
              )}

              {/* Title */}
              <div>
                <label className="font-semibold text-sm text-[#86654F]">
                  Service Title
                </label>
                <input
                  className="w-full p-4  bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
                  {...register("title")}
                />
                {errors.title && (
                  <span className="text-red-500 text-xs">
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Price & SubImages */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm text-[#86654F]">
                    Price Range
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full p-4  bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
                    {...register("priceRange", { valueAsNumber: true })}
                  />
                  {errors.priceRange && (
                    <span className="text-red-500 text-xs">
                      {errors.priceRange.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-sm text-[#86654F]">
                    Sub Images
                  </label>
                  <input
                    type="file"
                    multiple
                    className="w-full p-3 bg-[#FCF9F4] rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#A98770] file:text-white hover:file:bg-[#86654F]"
                     onChange={(e) => {
                       const files = e.target.files ? Array.from(e.target.files) : [];
                      setValue("subImages", files, { shouldValidate: true });
                         }}
                  />
                </div>
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
                  className="w-full p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
                  {...register("description")}
                />
              </div>

              {/* Preparations / Benefits / Tips */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#86654F] mb-1">
                    Preparations
                  </label>
                  <textarea
                    className="w-full p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
                    placeholder="Preparations"
                    {...register("preparations")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#86654F] mb-1">
                    Benefits
                  </label>
                  <textarea
                    className="w-full p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
                    placeholder="Benefits"
                    {...register("benefits")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#86654F] mb-1">
                    Tips
                  </label>
                  <textarea
                    className="w-full p-4 bg-[#FCF9F4] rounded-xl border border-[#ECE7E2] focus:ring-2 focus:ring-[#A98770] outline-none transition-all text-[#6D5240]"
                    placeholder="Tips"
                    {...register("tips")}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#86654F] text-white py-4 rounded-xl font-bold hover:bg-[#6d5240] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {updateService.isPending ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Update Service"
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
