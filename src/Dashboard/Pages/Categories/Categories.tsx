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
import { FaEdit, FaPlus, FaTrash, FaUndo } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import CategoryModal from "./Components/CategoryModal";
import DeleteModel from "./Components/DeleteModel";

export default function CategoriesDashboared() {
  const [showmodal, Setshowmodal] = useState(false);
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

  // add category
  const queryClient = useQueryClient();
  const addmutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      toast.success("Category added successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
      Setshowmodal(false);
    },
    onError: (error) => {
      console.log("add category error :", error);
      toast.error("Failed to add Category ", { position: "top-center" });
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
      toast.success("Category updated successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      Setshowmodal(false);
      setUpdateId(null);
    },
    onError: (error) => {
      console.log("update category error :", error);
      toast.error("Failed to update Category ", { position: "top-center" });
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
    onSuccess: () => {
      toast.success("Category deleted  successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.log("delete category error :", error);
      toast.error("Failed to delete Category ", { position: "top-center" });
    },
  });

  const handleDeleteCategory = (id: string) => {
    setDeleteId(id);
  };

  // soft delete
  const softdeletemutation = useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      softDeleteCategories(id, token),
    onSuccess: () => {
      toast.success("Category archived successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError(error) {
      console.log(" soft delete category error :", error);
      toast.error("Failed to archive Category ", { position: "top-center" });
    },
  });
  const handleSoftdeletecategory = (id: string) => {
    const token = localStorage.getItem("accessToken") || "";
    softdeletemutation.mutate({ id, token });
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
            className="bg-blue-50 text-blue-600 p-2 rounded-full
          border border-blue-100 hover:bg-blue-100 hover:scale-110 transition-all duration-150
          shadow-sm hover:shadow-md"
            onClick={() => openUpdateModal(row)}
          >
            <FaEdit size={15} />
          </button>

          <button
            className="bg-yellow-50 text-yellow-600 p-2 rounded-full 
          border border-yellow-100 hover:bg-yellow-100 hover:scale-110 transition-all duration-150
          shadow-sm hover:shawdow-md"
            onClick={() => handleSoftdeletecategory(row._id || "")}
          >
            <FaUndo size={15} />
          </button>

          <button
            className="bg-red-50 text-red-600 p-2 rounded-full
          border border-red-100 hover:bg-red-100 hover:scale-110 transition-all duration-150
          shadow-sm hover:shadow-md"
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#86654f]">Categories</h2>
        <button
          className="flex items-center gap-2 bg-[#86654f] text-white px-4 py-2 rounded shadow font-bold"
          onClick={() => {
            resetForm();
            Setshowmodal(true);
          }}
        >
          <FaPlus size={16} /> Add Category
        </button>
      </div>
      <DataTableComponent<ICategory>
        title="Categories List"
        columns={categorycolumns}
        loading={isLoading}
        data={data || []}
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

      {deleteId && (
        <DeleteModel
          title="Delete Category"
          message="Are you sure you want to delete this category?"
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            deletemutation.mutate(deleteId);
            setDeleteId(null);
          }}
        />
      )}
      <ToastContainer />
    </>
  );
}
