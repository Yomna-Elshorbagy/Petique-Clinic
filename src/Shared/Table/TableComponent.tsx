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
    <>
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
    </>
  );
}
export default DataTableComponent;

const customStyles = {
  headCells: {
    style: {
      fontWeight: "600",
      fontSize: "14px",
      backgroundColor: "var(--color-light-primary)",
      color: "var(--color-light-dark)",
      borderBottom: "1px solid var(--color-light-secondary)",
      paddingTop: "14px",
      paddingBottom: "14px",
    },
  },
  rows: {
    style: {
      backgroundColor: "var(--color-light-background)",
      color: "var(--color-light-dark)",
      fontSize: "14px",
      borderBottom: "1px solid var(--color-light-secondary)",
      "&:hover": {
        backgroundColor: "var(--color-light-secondary)",
        cursor: "pointer",
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: "var(--color-light-background)",
      color: "var(--color-light-dark)",
      borderTop: `1px solid var(--color-light-secondary)`,
      paddingTop: "10px",
      paddingBottom: "10px",
    },
    pageButtonsStyle: {
      fill: "var(--color-light-dark)",
      "&:hover": {
        backgroundColor: "var(--color-light-secondary)",
      },
      "&:disabled": {
        color: "var(--color-light-textSecondary)",
      },
    },
  },
};
