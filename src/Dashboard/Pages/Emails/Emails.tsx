import { useMutation, useQuery } from "@tanstack/react-query";
import DataTableComponent from "../../../Shared/Table/TableComponent";
import { contactColumns } from "./emailcolumn";
import {
  getAllContacts,
  softDeleteContact,
  deleteContact,
  replyToContact,
  updateContact,
} from "../../../Apis/EmailsApi";
import type { IContact } from "../../../Interfaces/IContact ";
import { toast } from "react-hot-toast";
import { useState } from "react";
import ReplyModal from "./Components/Replaymodel";
import EditModal from "./Components/Statusmodel";
import PreviewModal from "./Components/previewModel";
import Swal from "sweetalert2";

const token = localStorage.getItem("accessToken");

const ContactsDashboard = () => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatusContact, setSelectedStatusContact] =
    useState<IContact | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [replyStatus] = useState<"pending" | "inProgress" | "replied">(
    "pending"
  );


  const [filter, setFilter] = useState({
    email: "",
    name: "",
    urgency: "",
    replyStatus: "",
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["contact"],
    queryFn: () => getAllContacts(1, 10),
  });

  const filteredContacts = (data?.data || []).filter((c) => {
    return (
      c.email.toLowerCase().includes(filter.email.toLowerCase()) &&
      c.fullName.toLowerCase().includes(filter.name.toLowerCase()) &&
      (filter.urgency ? c.urgency === filter.urgency : true) &&
      (filter.replyStatus ? c.replyStatus === filter.replyStatus : true)
    );
  });

  const softDeleteMutation = useMutation({
    mutationFn: (id: string) => softDeleteContact(id, token!),
    onSuccess: () => {
      toast.success("Contact moved to trash (Soft Deleted)");
      refetch();
    },
    onError: () => toast.error("Soft delete failed"),
  });

  const hardDeleteMutation = useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      toast.success("Contact permanently deleted");
      refetch();
    },
    onError: () => toast.error("Hard delete failed"),
  });

  const handleSoftDelete = (id: string) => {
    Swal.fire({
      title: "Archive?",
      text: "This will soft-delete (archive) the contact.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, archive",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#F9BE91",
    }).then((result) => {
      if (result.isConfirmed) {
        softDeleteMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire({
              title: "Deleted!",
              text: "Contact moved to trash.",
              icon: "success",
              iconColor: "#F9BE91",
              confirmButtonColor: "#F9BE91",
            });
          },
        });
      }
    });
  };

  const handleHardDelete = (id: string) => {
    Swal.fire({
      title: "Delete permanently?",
      text: "This will permanently remove the contact and cannot be undone.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, delete permanently",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        hardDeleteMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire({
              title: "Deleted!",
              text: "Contact was permanently deleted.",
              icon: "success",
              iconColor: "#F9BE91",
              confirmButtonColor: "#F9BE91",
            });
          },
        });
      }
    });
  };

  const openReplyModal = (contact: IContact) => {
    setSelectedContact(contact);
    setIsReplyOpen(true);
  };

  const handleEdit = (contact: IContact) => {
    setSelectedStatusContact(contact);
    setIsStatusOpen(true);
  };

  const openPreviewModal = (contact: IContact) => {
    setSelectedContact(contact);
    setIsPreviewOpen(true);
  };

  const replyMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      replyToContact(id, message),
    onSuccess: () => {
      toast.success("Reply sent successfully");
      setIsReplyOpen(false);
      refetch();
    },
    onError: () => toast.error("Failed to send reply"),
  });

  const handleSendReply = (id: string, message: string) => {
    if (!message.trim()) return;

    replyMutation.mutate(
      { id, message },
      {
        onSuccess: () => {
          setIsReplyOpen(false);
          refetch();
          Swal.fire({
            title: "Sent!",
            text: "Reply sent successfully.",
            icon: "success",
            iconColor: "#F9BE91",
            confirmButtonColor: "#F9BE91",
          });
        },
        onError: () => {
          Swal.fire("Error", "Failed to send reply.", "error");
        },
      }
    );
  };

  console.log("STATUS FROM API:", replyStatus);

  const updateContactMutation = useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<IContact>;
    }) => updateContact(id, updatedData),
    onSuccess: () => {
      toast.success("Contact updated successfully");
      refetch();
    },
    onError: () => Swal.fire("Error", "Failed to update contact.", "error"),
  });

  const handleUpdateContact = (id: string, updatedData: Partial<IContact>) => {
    updateContactMutation.mutate(
      { id, updatedData },
      {
        onSuccess: () => {
          refetch();
          Swal.fire({
            title: "Updated",
            text: "Contact was updated successfully",
            icon: "success",
            iconColor: "#F9BE91",
            confirmButtonColor: "#F9BE91",
          });
        },
        onError: () => {
          Swal.fire("Error", "Failed to update contact.", "error");
        },
      }
    );
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Error fetching contacts</p>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Contacts Dashboard</h1>
      <div>
         <div className="flex flex-wrap gap-2 mb-4">
           <input
            type="text"
            name="email"
            placeholder="Filter by email"
            value={filter.email}
            onChange={handleFilterChange}
            className="border rounded p-1 w-75"
          />
          <input
            type="text"
            name="name"
            placeholder="Filter by name"
            value={filter.name}
            onChange={handleFilterChange}
            className="border rounded p-1 w-75"
          />
          <select
            name="urgency"
            value={filter.urgency}
            onChange={handleFilterChange}
            className="border rounded p-1 w-50"
          >
            <option value="">All Urgency</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="emergency">Emergency</option>
          </select>
          <select
            name="replyStatus"
            value={filter.replyStatus}
            onChange={handleFilterChange}
            className="border rounded p-1 w-50 "
          >
            <option value="">All Status</option>
            <option value="replied">Replied</option>
            <option value="inProgress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full">
          <DataTableComponent<IContact>
            columns={contactColumns({
              handleSoftDelete,
              handleHardDelete,
              openReplyModal,
              handleEdit,
              openPreviewModal,
            })}
            data={filteredContacts}
            loading={isLoading}
            pagination
          />
        </div>

        <ReplyModal
          isOpen={isReplyOpen}
          contact={selectedContact}
          onClose={() => setIsReplyOpen(false)}
          onSend={handleSendReply}
        />

        <EditModal
          isOpen={isStatusOpen}
          contact={selectedStatusContact}
          onClose={() => setIsStatusOpen(false)}
          onUpdateContact={handleUpdateContact}
        />

        <PreviewModal
          isOpen={isPreviewOpen}
          contact={selectedContact}
          onClose={() => setIsPreviewOpen(false)}
        />
      </div>

      

    </div>

    
  );
};

export default ContactsDashboard;
