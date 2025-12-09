import type { IContact } from "../IContact ";

export interface ReplyModalProps {
  isOpen: boolean;
  contact: IContact | null;
  onClose: () => void;
  onSend: (id: string, message: string) => void;
}