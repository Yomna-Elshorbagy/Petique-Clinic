import React from "react";
import { Dog, History, Weight } from "lucide-react";
import {
    type UseFormRegister,
    type FieldErrors,
    type UseFormSetValue,
} from "react-hook-form";
import type { FullReservationFormData } from "../../../../Utils/Schema/fullReservationSchema";
import type { IAnimalCategory } from "../../../../Interfaces/IAnimalCategory";

interface PetInfoStepProps {
    register: UseFormRegister<FullReservationFormData>;
    errors: FieldErrors<FullReservationFormData>;
    setValue: UseFormSetValue<FullReservationFormData>;
    animalCategories?: IAnimalCategory[];
}

const PetInfoStep: React.FC<PetInfoStepProps> = ({
    register,
    errors,
    setValue,
    animalCategories,
}) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center gap-3 text-2xl font-bold text-[var(--color-text-primary)] mb-6">
                <div className="p-2 bg-[var(--color-extra-5)] rounded-lg text-[var(--color-extra-2)]">
                    <Dog size={24} />
                </div>
                <h3>Pet Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
                        Pet Name
                    </label>
                    <input
                        {...register("pet.name")}
                        type="text"
                        placeholder="e.g. Max"
                        className={`w-full p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium ${errors.pet?.name
                                ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                                : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
                            }`}
                    />
                    {errors.pet?.name && (
                        <p className="text-red-500 text-xs ml-1">
                            {errors.pet.name.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
                        Category
                    </label>
                    <select
                        {...register("pet.category")}
                        className={`w-full p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium ${errors.pet?.category
                                ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                                : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
                            }`}
                    >
                        <option value="">Select Category</option>
                        {animalCategories?.map((cat: IAnimalCategory) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.pet?.category && (
                        <p className="text-red-500 text-xs ml-1">
                            {errors.pet.category.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2 ml-1">
                        <History size={16} className="text-[var(--color-extra-2)]" /> Age
                        (Years)
                    </label>
                    <input
                        {...register("pet.age", { valueAsNumber: true })}
                        type="number"
                        min="0"
                        className={`w-full p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium ${errors.pet?.age
                                ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                                : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
                            }`}
                    />
                    {errors.pet?.age && (
                        <p className="text-red-500 text-xs ml-1">
                            {errors.pet.age.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2 ml-1">
                        <Weight size={16} className="text-[var(--color-extra-2)]" /> Weight
                        (KG)
                    </label>
                    <input
                        {...register("pet.weight", { valueAsNumber: true })}
                        type="number"
                        min="0"
                        step="0.1"
                        className={`w-full p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium ${errors.pet?.weight
                                ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                                : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
                            }`}
                    />
                    {errors.pet?.weight && (
                        <p className="text-red-500 text-xs ml-1">
                            {errors.pet.weight.message}
                        </p>
                    )}
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
                        Medical Condition / Allergies
                    </label>
                    <textarea
                        placeholder="Mention any allergies or chronic conditions..."
                        className="w-full p-4 bg-[var(--color-bg-light)] border border-[var(--color-extra-3)] rounded-2xl focus:ring-4 focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)] outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium min-h-[100px]"
                        onChange={(e) =>
                            setValue(
                                "pet.allergies",
                                e.target.value.split(",").map((i) => i.trim()),
                                { shouldValidate: true }
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default PetInfoStep;
