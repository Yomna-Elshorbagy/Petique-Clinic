import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../Store/store";
import { getAllUsersThunk } from "../../../Store/User/UserThunks";
import DataTableComponent from "../../../Shared/Table/TableComponent";
import { UserColumns } from "./Components/UserColumns";
import UsersFilter from "./Components/UserFilter";
import type { IUser } from "../../../Interfaces/IUser";
import UserModal from "./Components/viewUserModal";
import UserEditModal from "./Components/EditUserModal";
import {
  handleEditUser,
  handleHardDeleteUser,
  handleSoftDeleteUser,
  handleViewUser,
} from "./Components/UserHandlers";

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading } = useSelector((state: RootState) => state.users);
  const petOwners = users.filter((u) => u.role === "petOwner");

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<IUser | null>(null);

  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return petOwners
      .filter((u) =>
        searchId ? u._id.toLowerCase().includes(searchId.toLowerCase()) : true
      )
      .filter((u) =>
        searchName
          ? u.userName.toLowerCase().includes(searchName.toLowerCase())
          : true
      )
      .filter((u) =>
        searchEmail
          ? u.email.toLowerCase().includes(searchEmail.toLowerCase())
          : true
      )
      .filter((u) =>
        searchPhone && u.mobileNumber
          ? u.mobileNumber.includes(searchPhone)
          : true
      )
      .filter((u) => {
        if (statusFilter === "pending") return !u.isVerified;
        if (statusFilter === "verified") return u.isVerified;
        return true;
      });
  }, [petOwners, searchId, searchName, searchEmail, searchPhone, statusFilter]);

  const resetFilters = () => {
    setSearchId("");
    setSearchName("");
    setSearchEmail("");
    setSearchPhone("");
    setStatusFilter("all");
  };

  return (
    <div className="w-full max-w-full px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-(--color-light-dark) dark:text-(--color-dark-text)">
          Pet Owners
        </h1>
      </div>
      <UsersFilter
        searchId={searchId}
        setSearchId={setSearchId}
        searchName={searchName}
        setSearchName={setSearchName}
        searchEmail={searchEmail}
        setSearchEmail={setSearchEmail}
        searchPhone={searchPhone}
        setSearchPhone={setSearchPhone}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        resetFilters={resetFilters}
      />

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
      />

      <UserEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={editUser}
      />

      <div style={{ marginTop: "24px" }}>
        <DataTableComponent
          columns={UserColumns(
            (user) => handleViewUser(user, setSelectedUser, setModalOpen),
            (user) => handleEditUser(user, setEditUser, setEditModalOpen),
            (id) => handleSoftDeleteUser(id, dispatch),
            (id) => handleHardDeleteUser(id, dispatch)
          )}
          data={filteredUsers}
          loading={loading}
        />
      </div>
    </div>
  );
}
