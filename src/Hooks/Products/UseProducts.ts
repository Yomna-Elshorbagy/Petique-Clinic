import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addProduct,
    deleteProduct,
    getProducts,
    softDeleteProducts,
    updateProduct,
} from "../../Apis/ProductsDashboard";
import Swal from "sweetalert2";

export const useProducts = () => {
    const queryClient = useQueryClient();

    const {
        data: productsData,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["products"],
        queryFn: () => getProducts(),
    });

    // Add Product Mutation
    const addProductMutation = useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            Swal.fire("Success", "Product added successfully", "success");
        },
        onError: (error: any) => {
            Swal.fire("Error", error?.response?.data?.message || "Failed to add product", "error");
        },
    });

    // Update Product Mutation
    const updateProductMutation = useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
            updateProduct(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            Swal.fire("Success", "Product updated successfully", "success");
        },
        onError: (error: any) => {
            Swal.fire("Error", error?.response?.data?.message || "Failed to update product", "error");
        },
    });

    // Soft Delete Mutation
    // const softDeleteMutation = useMutation({
    //     mutationFn: softDeleteProducts,
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["products"] });
    //         Swal.fire("Archived", "Product has been archived", "success");
    //     },
    //     onError: (error: any) => {
    //         Swal.fire("Error", error?.response?.data?.message || "Failed to archive product", "error");
    //     },
    // });

    // Hard Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            Swal.fire("Deleted", "Product has been deleted permanently", "success");
        },
        onError: (error: any) => {
            Swal.fire("Error", error?.response?.data?.message || "Failed to delete product", "error");
        },
    });

    return {
        products: productsData?.data || [],
        isLoading,
        error,
        refetch,
        addProduct: addProductMutation.mutateAsync,
        updateProduct: updateProductMutation.mutateAsync,
        // softDeleteProduct: softDeleteMutation.mutateAsync,
        deleteProduct: deleteMutation.mutateAsync,
        isAdding: addProductMutation.isPending,
        isUpdating: updateProductMutation.isPending,
    };
};
