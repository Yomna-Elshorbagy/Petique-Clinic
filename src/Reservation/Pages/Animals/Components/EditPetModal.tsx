import React, { useEffect, useState } from "react";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import { getAllAnimalCategories } from "../../../../Apis/AnimalCategory";
import type { IPet } from "../../../../Interfaces/Ipet";
import { useUpdatePet } from "../../../../Hooks/Pets/UsePets";

interface EditPetModalProps {
    pet: IPet | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditPetModal({ pet, isOpen, onClose, onSuccess }: EditPetModalProps) {
    const updateMutation = useUpdatePet();

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        weight: "",
        allergies: "",
    });

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && pet) {
            setFormData({
                name: pet.name || "",
                age: String(pet.age || ""),
                weight: String(pet.weight || ""),
                allergies: pet.allergies?.join(", ") || "",
            });

            setPreview(pet.image?.secure_url || null);
            fetchCategories();
        }
    }, [isOpen, pet]);

    const fetchCategories = async () => {
        const data = await getAllAnimalCategories();
        setCategories(data);
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: any) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("age", formData.age);
        fd.append("weight", formData.weight);

        formData.allergies
            .split(",")
            .map(a => a.trim())
            .filter(a => a)
            .forEach(a => fd.append("allergies[]", a));

        if (image) fd.append("image", image);

        updateMutation.mutate(
            { id: pet?._id!, formData: fd },
            {
                onSuccess: () => {
                    onSuccess();
                    onClose();
                },
                onError: (err: any) =>
                    setError(err.response?.data?.message || "Failed to update pet"),
            }
        );
    };

    if (!isOpen || !pet) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FCF9F4] w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

                <div className="flex justify-between items-center p-6 border-b border-[#ECE7E2]">
                    <h2 className="text-2xl font-bold text-[#86654F]">Edit Pet</h2>
                    <button onClick={onClose}>
                        <FaTimes size={22} className="text-[#A98770]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg">{error}</p>}

                    {/* Image */}
                    <div className="flex justify-center">
                        <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-[#A98770] overflow-hidden">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                onChange={handleImageChange}
                            />
                            {preview
                                ? <img src={preview} className="w-full h-full object-cover" />
                                : <div className="flex flex-col items-center justify-center h-full text-[#A98770]">
                                    <FaUpload />
                                    <small>Upload</small>
                                  </div>}
                        </div>
                    </div>

                    {/* Name */}
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl border"
                    />

                    {/* Age + Weight */}
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            className="p-3 rounded-xl border"
                        />
                        <input
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleChange}
                            className="p-3 rounded-xl border"
                        />
                    </div>

                    {/* Allergies */}
                    <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl border"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#86654F] text-white rounded-xl"
                    >
                        {updateMutation.isPending ? (
                            <FaSpinner className="animate-spin" />
                        ) : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
