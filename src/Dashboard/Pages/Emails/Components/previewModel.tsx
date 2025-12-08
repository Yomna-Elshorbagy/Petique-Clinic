import type { IContact } from "../../../../Interfaces/IContact";

interface PreviewModalProps {
  isOpen: boolean;
  contact: IContact | null;
  onClose: () => void;
}

const PreviewModal = ({ isOpen, contact, onClose }: PreviewModalProps) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-amber-50 p-6 rounded-xl w-96 shadow-lg border border-amber-200">
        <h2 className="text-2xl font-bold mb-4 text-[#86654f] text-center">Contact Preview</h2>

        <div className="space-y-2 text-[#86654f]">
          <p><span className="font-semibold ">Full Name:</span> {contact.fullName}</p>
          <p><span className="font-semibold ">Category:</span> {contact.category}</p>
          <p><span className="font-semibold ">Pet Age:</span> {contact.petAge}</p>
          <p><span className="font-semibold ">Reply Status:</span> {contact.replyStatus}</p>
          <p><span className="font-semibold">Urgency:</span> {contact.urgency ?? "N/A"}</p>
        </div>

        <button
          className="mt-6 w-full bg-[#e9a66f] hover:bg-orange-300 text-white font-semibold py-2 rounded-lg transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PreviewModal;
