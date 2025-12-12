import Swal from "sweetalert2";
import type { AppDispatch } from "../../../../Store/store";
import { hardDeleteUser, softDeleteUser } from "../../../../Apis/UsersApis";
import { getAllUsersThunk } from "../../../../Store/User/UserThunks";
import type { IUser } from "../../../../Interfaces/IUser";

// view user
export const handleViewUser = (
  user: IUser,
  setSelectedUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setSelectedUser(user);
  setModalOpen(true);
};

// Edit user
export const handleEditUser = (
  user: IUser,
  setEditUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setEditUser(user);
  setEditModalOpen(true);
};

// soft delete user
export const handleSoftDeleteUser = async (id: string, dispatch: AppDispatch) => {
  try {
    const result = await Swal.fire({
      title: "Archive user?",
      text: "This will soft-delete (archive) the user.",
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

    await softDeleteUser(id);

    Swal.close();
    await Swal.fire({
      title: "Archived",
      text: "User was archived successfully.",
      icon: "success",
      timer: 1400,
      showConfirmButton: false,
    });

    dispatch(getAllUsersThunk());
  } catch (error: any) {
    console.error("Soft delete failed", error);
    Swal.close();
    Swal.fire({
      title: "Error",
      text: error?.response?.data?.message || "Failed to archive user.",
      icon: "error",
    });
  }
};

// hard delete user
export const handleHardDeleteUser = async (id: string, dispatch: AppDispatch) => {
  try {
    const result = await Swal.fire({
      title: "Delete permanently?",
      text: "This will permanently remove the user and cannot be undone.",
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

    await hardDeleteUser(id);

    Swal.close();
    await Swal.fire({
      title: "Deleted",
      text: "User was permanently deleted.",
      icon: "success",
      timer: 1400,
      showConfirmButton: false,
    });

    dispatch(getAllUsersThunk());
  } catch (error: any) {
    console.error("Hard delete failed", error);
    Swal.close();
    Swal.fire({
      title: "Error",
      text: error?.response?.data?.message || "Failed to delete user.",
      icon: "error",
    });
  }
};