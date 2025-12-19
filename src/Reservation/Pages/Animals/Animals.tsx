import { useEffect, useState } from "react";
import { deletePet, getAllPets, softDeletePet } from "../../../Apis/PetApis";
import type { IPet } from "../../../Interfaces/Ipet";
import AddPetModal from "./Components/AddPetModal";
import { FaSearch, FaPlus } from "react-icons/fa";
import { usePetSearch } from "./Hook/UseAnimalSearch";
import PetCard from "./Components/PetCard";
import Swal from "sweetalert2";
import { useLocalPagination } from "../../Componenst/Pagination/UsePagination";
import Pagination from "../../Componenst/Pagination/Pagination";
import EditPetModal from "./Components/EditPetModal";
import PetDetailsModal from "./Components/PetDetailsModal";
import SEO from "../../../Components/SEO/SEO";

export default function Animals() {
  const [pets, setPets] = useState<IPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FIXED: missing state
  const [selectedPet, setSelectedPet] = useState<IPet | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const { search, setSearch, filtered } = usePetSearch(pets);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const data = await getAllPets();
      setPets(data);
    } catch (error) {
      console.error("Failed to fetch pets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const categories = ["All", "Dog", "Cat", "Turtles", "Rabbits"];

  const filteredPets =
    activeCategory === "All"
      ? filtered
      : filtered.filter(
          (pet) =>
            pet.category?.name.toLowerCase() === activeCategory.toLowerCase()
        );

  const { paginatedItems, page, totalPages, goToPage } = useLocalPagination(
    filteredPets,
    8
  );

  const [_processingId, setProcessingId] = useState<string | null>(null);

  const handleSoftDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Archive pet?",
        text: "This will soft-delete (archive) the pet. You can restore it later.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, archive",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#F9BE91",
      });

      if (!result.isConfirmed) return;

      setProcessingId(id);
      Swal.fire({
        title: "Archiving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await softDeletePet(id);

      Swal.close();
      await Swal.fire({
        title: "Archived",
        text: "Pet was archived successfully.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });

      await fetchPets();
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to archive pet",
        icon: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleHardDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete permanently?",
        text: "This cannot be undone.",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        confirmButtonColor: "#d33",
      });

      if (!result.isConfirmed) return;

      setProcessingId(id);
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await deletePet(id);

      Swal.close();
      await Swal.fire({
        title: "Deleted",
        text: "Pet was permanently deleted.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });

      await fetchPets();
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to delete pet",
        icon: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // FIX: open details modal
  const handleViewDetails = (pet: IPet) => {
    setViewId(pet._id);
  };

  // FIX: open edit modal
  const handleEdit = (pet: IPet) => {
    setSelectedPet(pet);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedItems.map((pet) => (
        <PetCard
          pet={pet}
          key={pet._id}
          view="grid"
          onSoftDelete={handleSoftDelete}
          onHardDelete={handleHardDelete}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="flex flex-col gap-4">
      {paginatedItems.map((pet) => (
        <PetCard
          pet={pet}
          key={pet._id}
          view="list"
          onSoftDelete={handleSoftDelete}
          onHardDelete={handleHardDelete}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ECE7E2] p-6 font-['Inter']">
      <SEO
        title="Animals | Dashboard Petique Clinic"
        description="Manage animal for reservations and veterinary services at Petique Clinic."
      />

      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPets}
      />

      <EditPetModal
        pet={selectedPet}
        isOpen={!!selectedPet}
        onClose={() => setSelectedPet(null)}
        onSuccess={fetchPets}
      />

      <PetDetailsModal
        petId={viewId}
        isOpen={!!viewId}
        onClose={() => setViewId(null)}
      />

      {/* header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#86654F] mb-1">Animals</h1>
          <p className="text-[#A98770]">Manage your pet patients</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#86654F] text-white px-6 py-2.5 rounded-xl hover:bg-[#6d5240] transition-colors shadow-sm"
        >
          <FaPlus size={14} />
          <span>Add New Pet</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98770]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pets..."
            className="w-1/4 pl-11 pr-4 py-3 rounded-xl bg-[#FCF9F4] border-none focus:ring-2 focus:ring-[#A98770]/50 text-[#86654F] placeholder-[#A98770]/70 shadow-sm"
          />
        </div>
      </div>

      {/* category filters */}
      <div className="w-full flex justify-center">
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide max-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                activeCategory === cat
                  ? "bg-[#A98770] text-white shadow-md"
                  : "bg-[#FCF9F4] text-[#86654F] hover:bg-[#e8d8c4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#86654F]">Loading pets...</div>
      ) : viewMode === "grid" ? (
        renderGridView()
      ) : (
        renderListView()
      )}

      {!loading && filteredPets.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
