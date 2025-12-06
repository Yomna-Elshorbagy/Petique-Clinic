import type { TableColumn } from "react-data-table-component";

export interface DataTableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  selectableRows?: boolean;
  onRowClicked?: (row: T) => void;
  pagination?: boolean;
  loading: boolean;
  handleSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}