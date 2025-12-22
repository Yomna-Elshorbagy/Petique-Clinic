import { useEffect, useState } from "react";
import { FaPaw, FaImage } from "react-icons/fa";

interface Pet {
  _id: string;
  name: string;
  age: number;
  weight: number;
  allergies?: string[];
}

interface EditPetModalProps {
  open: boolean;
  onClose: () => void;
  pet: Pet | null;
  onSubmit: (id: string, formData: FormData) => void;
  loading: boolean;
}

interface FormState {
  name: string;
  age: string;
  weight: string;
  allergies: string;
  image: File | null;
}

export default function EditPetModal({
  open,
  onClose,
  pet,
  onSubmit,
  loading,
}: EditPetModalProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    age: "",
    weight: "",
    allergies: "",
    image: null,
  });

  useEffect(() => {
    if (pet) {
      setForm({
        name: pet.name,
        age: pet.age.toString(),
        weight: pet.weight.toString(),
        allergies: pet.allergies?.join(", ") || "",
        image: null,
      });
    }
  }, [pet]);

  if (!open || !pet) return null;

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("age", form.age);
    formData.append("weight", form.weight);
    form.allergies
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .forEach((allergy) => formData.append("allergies[]", allergy));

    if (form.image) {
      formData.append("image", form.image);
    }

    onSubmit(pet._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] rounded-2xl w-full max-w-lg shadow-xl animate-slideUp">
        {/* HEADER */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
          <div className="p-2 rounded-full bg-[var(--color-light-accent)]/20 text-[var(--color-light-accent)]">
            <FaPaw />
          </div>
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
            Edit Pet Information
          </h3>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <input
            className="input-box"
            placeholder="Pet Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className="input-box"
              placeholder="Age"
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />

            <input
              className="input-box"
              placeholder="Weight (kg)"
              type="number"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </div>

          <input
            className="input-box"
            placeholder="Allergies (comma separated)"
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
          />

          {/* IMAGE UPLOAD */}
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[var(--color-border-medium)] cursor-pointer hover:bg-[var(--color-bg-cream)] dark:hover:bg-[var(--color-dark-bg-hover)] transition">
            <FaImage className="text-[var(--color-light-accent)]" />
            <span className="text-sm text-[var(--color-text-muted)]">
              {form.image ? form.image.name : "Upload new pet image"}
            </span>
            <input
              type="file"
              hidden
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.files ? e.target.files[0] : null,
                })
              }
            />
          </label>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[var(--color-border-medium)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-cream)] transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-[var(--color-light-accent)] text-white font-medium hover:bg-[var(--color-accent-dark)] transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
