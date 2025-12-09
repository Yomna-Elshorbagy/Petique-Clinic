import type { IContact } from "../IContact ";


export interface PreviewModalProps {
  isOpen: boolean;
  contact: IContact | null;
  onClose: () => void;
}