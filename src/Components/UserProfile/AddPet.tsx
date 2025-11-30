import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAddPet } from "../../Hooks/UserProfile/useAddPet";
import { useAnimalCategories } from "../../Hooks/Categories/useAnimalCategories";
import { useVaccinations, type Vaccination } from "../../Hooks/Vaccinations/useVaccinations";

interface VaccinationSelection {
  vaccineId: string;
  date: string;
  nextDose: string;
}

export default function AddPetForm() {
  const { formData, setFormData, mutation } = useAddPet();
  const { data: categories = [], isLoading: catLoading } = useAnimalCategories();
  const { data: vaccinations = [], isLoading: vacLoading } = useVaccinations();

  // Selected vaccinations state
  const [selectedVaccinations, setSelectedVaccinations] = useState<VaccinationSelection[]>([]);

  // Field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Toggle vaccination checkbox
  const handleVaccinationCheck = (vaccine: Vaccination, checked: boolean) => {
    if (checked) {
      setSelectedVaccinations(prev => [
        ...prev,
        { vaccineId: vaccine._id, date: "", nextDose: "" },
      ]);
    } else {
      setSelectedVaccinations(prev =>
        prev.filter(v => v.vaccineId !== vaccine._id)
      );
    }
  };

  const handleVaccinationDateChange = (
    vaccineId: string,
    field: "date" | "nextDose",
    value: string
  ) => {
    setSelectedVaccinations(prev =>
      prev.map(v =>
        v.vaccineId === vaccineId ? { ...v, [field]: value } : v
      )
    );
  };

  // ---- FILTER VACCINATIONS BY CATEGORY ----
  const filteredVaccinations =
    formData.category && vaccinations.length > 0
      ? vaccinations.filter(v =>
          v.categories.includes(formData.category)
        )
      : [];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) finalFormData.append(key, value);
    });

    finalFormData.append("vaccinationHistory", JSON.stringify(selectedVaccinations));

    mutation.mutate(finalFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <input
        name="name"
        placeholder="Pet Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border border-[#A98868] rounded-md px-3 py-2"
      />

      <input
        name="age"
        type="number"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        className="w-full border border-[#A98868] rounded-md px-3 py-2"
      />

      <input
        name="weight"
        type="number"
        placeholder="Weight"
        value={formData.weight}
        onChange={handleChange}
        className="w-full border border-[#A98868] rounded-md px-3 py-2"
      />

      {/* CATEGORY SELECT */}
      {catLoading ? (
        <p>Loading categories...</p>
      ) : (
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border border-[#A98868] rounded-md px-3 py-2"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}

      <input
        name="image"
        type="file"
        onChange={handleChange}
        className="w-full border border-[#A98868] rounded-md px-3 py-2"
      />

      {/* ALLERGIES */}
      <input
        placeholder="Allergies (comma separated)"
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            allergies: e.target.value.split(","),
          }))
        }
        className="w-full border border-[#A98868] rounded-md px-3 py-2 md:col-span-2"
      />

      {/*==== FILTERED VACCINATIONS ====*/}
      {vacLoading ? (
        <p>Loading vaccinations...</p>
      ) : (
        <div className="md:col-span-2 border p-2 rounded-md border-[#A98868]">
          <p className="font-semibold mb-2">Vaccinations:</p>

          {!formData.category && (
            <p className="text-sm text-gray-500">Select a category first</p>
          )}

          {formData.category && filteredVaccinations.length === 0 && (
            <p className="text-sm text-red-500">No vaccinations for this category</p>
          )}

          {filteredVaccinations.map(vac => {
            const selected = selectedVaccinations.find(
              s => s.vaccineId === vac._id
            );

            return (
              <div key={vac._id} className="mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={(e) =>
                      handleVaccinationCheck(vac, e.target.checked)
                    }
                  />
                  {vac.name}
                </label>

                {selected && (
                  <div className="ml-6 mt-1 flex gap-2">
                    <input
                      type="date"
                      value={selected.date}
                      onChange={(e) =>
                        handleVaccinationDateChange(
                          vac._id,
                          "date",
                          e.target.value
                        )
                      }
                      className="border border-[#A98868] rounded-md px-2 py-1"
                    />

                    <input
                      type="date"
                      value={selected.nextDose}
                      onChange={(e) =>
                        handleVaccinationDateChange(
                          vac._id,
                          "nextDose",
                          e.target.value
                        )
                      }
                      className="border border-[#A98868] rounded-md px-2 py-1"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="submit"
        className="bg-[#F19645] text-white px-6 py-2 rounded-md hover:bg-[#F2A056] transition md:col-span-2"
      >
        {mutation.isLoading ? "Adding..." : "Add Pet"}
      </button>
    </form>
  );
}
