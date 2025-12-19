import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  softDeleteCategories,
  updateCategory,
} from "../../../Apis/CategoryApis";
import type { TableColumn } from "react-data-table-component";
import type { ICategory } from "../../../Interfaces/categryInterfaces";
import DataTableComponent from "../../../Shared/Table/TableComponent";
import {
  FaEdit,
  FaPlus,
  FaPlusCircle,
  FaTrash,
  FaUndo,
  FaSearch,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import CategoryModal from "./Components/CategoryModal";
import DeleteModel from "./Components/DeleteModel";
import Swal from "sweetalert2";
import SEO from "../../../Components/SEO/SEO";

export default function CategoriesDashboared() {
  const [showmodal, Setshowmodal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [newcategoryName, SetnewcategoryName] = useState("");
  const [newcategoryImage, SetnewcategoryImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  // get categories
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Filter categories
  const filteredCategories = React.useMemo(() => {
    let filtered = data || [];

    if (searchId) {
      const searchLower = searchId.toLowerCase();
      filtered = filtered.filter((category: ICategory) =>
        category._id?.toLowerCase().includes(searchLower)
      );
    }

    if (searchName) {
      const searchLower = searchName.toLowerCase();
      filtered = filtered.filter((category: ICategory) =>
        category.name?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [data, searchId, searchName]);

  const resetFilters = () => {
    setSearchId("");
    setSearchName("");
  };

  const hasActiveFilters = searchId || searchName;

  // add category
  const queryClient = useQueryClient();
  const addmutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      Swal.fire({
        title: "Success",
        text: "Category added successfully!",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
      Setshowmodal(false);
    },
    onError: (error: any) => {
      console.error("add category failed", error);
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to add Category",
        icon: "error",
      });
    },
  });

  const handleAddCategory = () => {
    if (!newcategoryName || !newcategoryImage) {
      setErrorMessage("Please Enter both name and image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newcategoryName);
    formData.append("image", newcategoryImage);
    addmutation.mutate(formData);
  };

  // update category
  const updatemutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateCategory(id, formData),
    onSuccess: () => {
      Swal.fire({
        title: "Success",
        text: "Category updated successfully!",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      Setshowmodal(false);
      setUpdateId(null);
    },
    onError: (error: any) => {
      console.error("update category failed", error);
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to update Category",
        icon: "error",
      });
    },
  });
  const handleUpdatecategory = () => {
    if (!newcategoryName) {
      setErrorMessage("Please enter category name");
      return;
    }
    const formData = new FormData();
    formData.append("name", newcategoryName);
    if (newcategoryImage) formData.append("image", newcategoryImage);
    updatemutation.mutate({ id: updateId!, formData });
  };

  //reset

  const resetForm = () => {
    SetnewcategoryName("");
    SetnewcategoryImage(null);
    setErrorMessage("");
    setUpdateId(null);
    setPreviewImageUrl(null);
  };
  //
  const openUpdateModal = (category: ICategory) => {
    setUpdateId(category._id || null);
    SetnewcategoryName(category.name);
    setPreviewImageUrl(category.image?.secure_url || null);
    SetnewcategoryImage(null);
    Setshowmodal(true);
  };
  // delete category
  const deletemutation = useMutation({
    mutationFn: deleteCategory,
  });

  const handleDeleteCategory = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Delete permanently?",
        text: "This will permanently remove the category and cannot be undone.",
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

      await deletemutation.mutateAsync(id);

      Swal.close();
      await Swal.fire({
        title: "Deleted",
        text: "Category was permanently deleted.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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

  // soft delete
  const softdeletemutation = useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      softDeleteCategories(id, token),
  });
  const handleSoftdeletecategory = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return toast.error("Unauthorized");
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

      await softdeletemutation.mutateAsync({ id, token });

      Swal.close();
      await Swal.fire({
        title: "Archived",
        text: "Category was archived successfully.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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

  const categorycolumns: TableColumn<ICategory>[] = [
    {
      name: "ID",
      cell: (row) => {
        const id = row._id || "";
        const lastFive = id.slice(-5);
        return `#${lastFive}`;
      },
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) => (
        <div className="flex items-center">
          <img
            src={row.image?.secure_url || "/placeholder-100x100.png"}
            alt={row.name || "category"}
            style={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 8,
              display: "block",
            }}
            onError={(e: any) => {
              e.currentTarget.src = "/placeholder-100x100.png";
            }}
          />
        </div>
      ),
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },

    {
      name: "Products",
      selector: (row) => row.productCount ?? 0,
      sortable: true,
      cell: (row) => (
        <span className="px-3 py-1 bg-[#F9EBE0] text-[#443935] rounded-full text-sm">
          {row.productCount ?? 0}
        </span>
      ),
    },

    {
      name: "Created By",
      selector: (row) => row.createdBy?.userName || "Unknown",
      sortable: true,
      wrap: true,
      cell: (row) => (
        <span className="text-[#86654f] font-medium">
          {row.createdBy?.userName || "Unknown"}
        </span>
      ),
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-lg bg-green-50 text-green-600 
               hover:bg-green-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-green-100"
            onClick={() => openUpdateModal(row)}
          >
            <FaEdit size={15} />
          </button>

          <button
            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 
               hover:bg-yellow-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-yellow-100"
            onClick={() => handleSoftdeletecategory(row._id || "")}
          >
            <FaUndo size={15} />
          </button>

          <button
            className="p-2 rounded-lg bg-red-50 text-red-600 
               hover:bg-red-100 transition-all duration-200
               hover:scale-[1.07] active:scale-[0.96]
               shadow-sm hover:shadow-md border border-red-100"
            onClick={() => handleDeleteCategory(row._id || "")}
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
      button: true,
      width: "150px",
    },
  ];

  return (
    <>
      <SEO
        title="Categories | Dashboard Petique Clinic "
        description="Manage service and product categories for veterinary care and pet services in Petique Clinic."
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#86654f]">Categories</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 
            bg-[var(--color-extra-1)] 
            text-[var(--color-light-dark)]
            font-semibold rounded-xl shadow-md
            hover:bg-[var(--color-light-accent)]
            transition-all duration-300 
            hover:scale-105 active:scale-95"
          onClick={() => {
            resetForm();
            Setshowmodal(true);
          }}
        >
          <FaPlusCircle /> Add Category
        </button>
      </div>

      {/* Search Filters */}
      <div className="mb-4">
        <div className="flex gap-4 flex-wrap items-center">
          {/* ID Search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
            {searchId && (
              <button
                onClick={() => setSearchId("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Name Search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
            />
            {searchName && (
              <button
                onClick={() => setSearchName("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
            title="Reset Filters"
          >
            Reset
          </button>
        </div>

        {/* Results Counter */}
        {hasActiveFilters && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredCategories.length} categor
            {filteredCategories.length !== 1 ? "ies" : "y"}
          </p>
        )}
      </div>

      <DataTableComponent<ICategory>
        columns={categorycolumns}
        loading={isLoading}
        data={filteredCategories}
        pagination
      />

      {showmodal && (
        <CategoryModal
          onClose={() => {
            Setshowmodal(false);
          }}
          updateId={updateId}
          categoryName={newcategoryName}
          setCategoryName={SetnewcategoryName}
          categoryImage={newcategoryImage}
          setCategoryImage={SetnewcategoryImage}
          previewImageUrl={previewImageUrl}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          onAdd={handleAddCategory}
          onUpdate={handleUpdatecategory}
          loading={addmutation.isPending || updatemutation.isPending}
        />
      )}
    </>
  );
}
