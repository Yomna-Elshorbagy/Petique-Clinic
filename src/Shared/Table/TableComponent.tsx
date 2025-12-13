import DataTable from "react-data-table-component";
import type { DataTableProps } from "../../Interfaces/ITableProps";

function DataTableComponent<T>({
  title,
  columns,
  data,
  selectableRows = false,
  onRowClicked,
  pagination = true,
  loading,
}: DataTableProps<T>) {
  return (
    <div className="w-full">
      <DataTable
        title={title}
        columns={columns}
        data={data}
        progressPending={loading}
        striped
        responsive
        selectableRows={selectableRows}
        onRowClicked={onRowClicked}
        pagination={pagination}
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        highlightOnHover
        customStyles={customStyles}
      />
    </div>
  );
}
export default DataTableComponent;

const customStyles = {
  table: {
    style: {
      backgroundColor: "var(--color-light-background)",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
      animation: "fadeIn 0.3s ease-out",
      minWidth: "100%",
    },
  },
  headRow: {
    style: {
      backgroundColor: "var(--color-light-primary)",
      borderBottom: "1px solid var(--color-light-secondary)",
      minHeight: "48px",
      "@media (max-width: 768px)": {
        minHeight: "40px",
      },
    },
  },
  headCells: {
    style: {
      fontWeight: "600",
      fontSize: "14px",
      color: "var(--color-light-dark)",
      backgroundColor: "var(--color-light-primary)",
      paddingTop: "14px",
      paddingBottom: "14px",
      transition: "all 0.25s ease",
      "@media (max-width: 768px)": {
        fontSize: "12px",
        paddingTop: "10px",
        paddingBottom: "10px",
      },
    },
  },
  rows: {
    style: {
      backgroundColor: "var(--color-light-background)",
      color: "var(--color-light-dark)",
      fontSize: "14px",
      borderBottom: "1px solid var(--color-light-secondary)",
      transition: "all 0.25s ease",
      minHeight: "54px",
      "@media (max-width: 768px)": {
        fontSize: "12px",
        minHeight: "48px",
      },
      "&:hover": {
        backgroundColor: "var(--color-light-extra-5, #f9ebe0)",
        transform: "scale(1.002)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      },
    },
  },
  cells: {
    style: {
      padding: "14px 12px",
      "@media (max-width: 768px)": {
        padding: "10px 8px",
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: "var(--color-light-background)",
      color: "var(--color-light-dark)",
      borderTop: "1px solid var(--color-light-secondary)",
      paddingTop: "10px",
      paddingBottom: "10px",
      fontWeight: "500",
      fontSize: "14px",
      "@media (max-width: 768px)": {
        fontSize: "12px",
        paddingTop: "8px",
        paddingBottom: "8px",
      },
    },
    pageButtonsStyle: {
      borderRadius: "8px",
      padding: "6px 10px",
      transition: "all 0.2s ease",
      fill: "var(--color-light-dark)",
      "@media (max-width: 768px)": {
        padding: "4px 8px",
      },
      "&:hover": {
        backgroundColor: "var(--color-light-primary)",
        transform: "scale(1.05)",
      },
      "&:disabled": {
        opacity: 0.4,
      },
    },
  },
};
