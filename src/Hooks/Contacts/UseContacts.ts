import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { getAllContacts, getDeletedContacts, replyToContact, restoreContact, softDeleteContact } from "../../Apis/EmailsApi";


/* ===== Inbox ===== */
export const useContacts = (page = 1, limit = 8) => {
  return useQuery({
    queryKey: ["contacts", page, limit],
    queryFn: () => getAllContacts(page, limit),
  });
};

/* ===== Deleted (Trash) ===== */
export const useDeletedContacts = (page = 1, limit = 8) => {
  const {
    data: deletedData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["deletedContacts", page, limit],
    queryFn: () => getDeletedContacts(page, limit),
  });

  return {
    deletedContacts: deletedData?.data || [],
    total: deletedData?.results || 0,
    isLoading,
    error,
    refetch,
  };
};

/* ===== Reply ===== */
export const useReplyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      replyToContact(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      Swal.fire("Sent", "Reply sent successfully", "success");
    },
  });
};

/* ===== Soft Delete ===== */
export const useSoftDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      softDeleteContact(id, localStorage.getItem("accessToken")!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["deletedContacts"] });
      Swal.fire("Archived", "Message moved to trash", "success");
    },
  });
};

/* ===== Restore ===== */
export const useRestoreContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["deletedContacts"] });
      Swal.fire("Restored", "Message restored successfully", "success");
    },
  });
};
