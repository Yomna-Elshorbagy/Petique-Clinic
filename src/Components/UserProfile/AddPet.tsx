import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAddPet } from "../../Hooks/UserProfile/useAddPet";
import { useAnimalCategories } from "../../Hooks/Categories/useAnimalCategories";
import { petSchema } from "../../Utils/Schema/petSchema";

export default function AddPetForm() {
  const { formData, setFormData, mutation } = useAddPet();
  const { data: categories = [], isLoading: catLoading } =
    useAnimalCategories();
  const [errors, setErrors] = useState<Record<string, string>>({});

  //===> Field changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  //===> Form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // ===> Validate with Zod
    const validationResult = petSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // ===> Build FormData
    const finalFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) finalFormData.append(key, value);
    });

    mutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* Pet Name */}
      <div className="flex flex-col">
        <input
          name="name"
          placeholder="Pet Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-[var(--color-border-medium)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name}</span>
        )}
      </div>

      {/* Age */}
      <div className="flex flex-col">
        <input
          name="age"
          type="number"
          min={1}
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full border border-[var(--color-border-medium)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
        />
        {errors.age && (
          <span className="text-red-500 text-sm">{errors.age}</span>
        )}
      </div>

      {/* Weight */}
      <div className="flex flex-col">
        <input
          name="weight"
          type="number"
          min={1}
          placeholder="Weight"
          value={formData.weight}
          onChange={handleChange}
          className="w-full border border-[var(--color-border-medium)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
        {errors.weight && (
          <span className="text-red-500 text-sm">{errors.weight}</span>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col">
        {catLoading ? (
          <p>Loading categories...</p>
        ) : (
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-[var(--color-border-medium)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
        {errors.category && (
          <span className="text-red-500 text-sm">{errors.category}</span>
        )}
      </div>

      {/* Image */}
      <input
        name="image"
        type="file"
        onChange={handleChange}
        className="w-full border border-[#cccccc] dark:border-[#555555] rounded-md px-3 py-2 bg-[#fdfdfd] dark:bg-[#1c1c1c] text-[#111111] dark:text-[#f0f0f0]"
      />

      {/* Allergies */}
      <input
        placeholder="Allergies (comma separated)"
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            allergies: e.target.value.split(","),
          }))
        }
        className="w-full border border-[var(--color-border-medium)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] placeholder:text-gray-400 dark:placeholder:text-gray-500 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
      />

      {/* Submit */}
      <button
        type="submit"
        className="bg-[#F19645] dark:bg-[#F19645] text-white px-6 py-2 rounded-md hover:bg-[#F2A056] dark:hover:bg-[#F2A056] transition md:col-span-2"
      >
        {mutation.isPending ? "Adding..." : "Add Pet"}
      </button>
    </form>
  );
}
