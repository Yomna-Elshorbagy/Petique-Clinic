import type{ IContact } from "../IContact ";

export interface EditModalProps {
  isOpen: boolean;
  contact: IContact | null;
  onClose: () => void;
  onUpdateContact: (id: string, updatedData: Partial<IContact>) => void;
}