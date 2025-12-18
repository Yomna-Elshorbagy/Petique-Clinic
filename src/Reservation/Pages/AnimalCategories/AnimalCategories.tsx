import { useEffect, useState } from "react";
import {
  getAllAnimalCategories,
  softDeleteAnimalCategory,
  deleteAnimalCategory,
} from "../../../Apis/AnimalCategory";
import { FaSearch, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import type { IAnimalCategory } from "../../../Interfaces/IAnimalCategory";
import AddAnimalCategoryModal from "./Components/AddAnimalCategoryModal";
import { getCountCategoryPet } from "../../../Apis/PetApis";
import CategoryOverview from "./Components/OverViewCat";
import AnimalCategoryCard from "./Components/AnimalCategoryCard";
import { useLocalPagination } from "../../Componenst/Pagination/UsePagination";
import Pagination from "../../Componenst/Pagination/Pagination";
import EditAnimalCategoryModal from "./Components/EditAnimalCategoryModal";
import SEO from "../../../Components/SEO/SEO";

export default function AnimalCategories() {
  const [categories, setCategories] = useState<IAnimalCategory[]>([]);
  const [displayedCategories, setDisplayedCategories] = useState<
    IAnimalCategory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [petCounts, setPetCounts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllAnimalCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountAnimals = async () => {
    try {
      setLoading(true);
      const data = await getCountCategoryPet();
      setPetCounts(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCountAnimals();
  }, []);

  useEffect(() => {
    if (!categories.length) return;

    const merged = categories.map((cat) => {
      const match = petCounts.find((p) => p.categoryId === cat._id);
      return {
        ...cat,
        petCount: match ? match.totalPets : 0,
      };
    });

    setDisplayedCategories(merged);
  }, [categories, petCounts]);

  const filteredCategories = displayedCategories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const { paginatedItems, page, totalPages, goToPage } = useLocalPagination(
    filteredCategories,
    6
  );

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleSoftDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Archive category?",
        text: "This will soft-delete (archive) the category.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, archive",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#F9BE91",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Archiving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await softDeleteAnimalCategory(id);

      Swal.close();
      await Swal.fire({
        title: "Archived",
        text: "Category was archived successfully.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      await fetchCategories();
    } catch (error: any) {
      console.error("Soft delete failed", error);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to archive category.",
        icon: "error",
      });
    }
  };

  const handleHardDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete permanently?",
        text: "This will permanently remove the category.",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes, delete permanently",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "red",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await deleteAnimalCategory(id);

      Swal.close();
      await Swal.fire({
        title: "Deleted",
        text: "Category was permanently deleted.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      await fetchCategories();
    } catch (error: any) {
      console.error("Hard delete failed", error);
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to delete category.",
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#ECE7E2] p-6 font-['Inter']">
      <SEO
        title="Animal Category | Dashboard Petique Clinic"
        description="Manage animal categories for reservations and veterinary services at Petique Clinic."
      />

      <AddAnimalCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCategories}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#86654F] mb-1">
            Animal Categories
          </h1>
          <p className="text-[#A98770]">Organize pets by species</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#86654F] text-white px-6 py-2.5 rounded-xl hover:bg-[#6d5240] transition-colors shadow-sm"
        >
          <FaPlus size={14} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="relative mb-8">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98770]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FCF9F4] border-none focus:ring-2 focus:ring-[#A98770]/50 text-[#86654F] placeholder-[#A98770]/70 shadow-sm"
        />
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center py-20 text-[#86654F]">
          Loading categories...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((cat, index) => (
              <AnimalCategoryCard
                key={cat._id}
                category={cat}
                index={index}
                onSoftDelete={handleSoftDelete}
                onHardDelete={handleHardDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
          <EditAnimalCategoryModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            category={selectedCategory}
            onSuccess={fetchCategories}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}

      <div className="my-8">
        <CategoryOverview categories={displayedCategories} />
      </div>
    </div>
  );
}
