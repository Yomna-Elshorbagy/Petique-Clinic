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
      fontWeight: "bold",
      fontSize: "15px",
      backgroundColor: "var(--color-light-primary)",
      color: "var(--color-light-dark)",
    },
  },
  rows: {
    style: {
      backgroundColor: "var(--color-light-background)",
      color: "var(--color-light-dark)",
      "&:hover": {
        backgroundColor: "var(--color-light-secondary)",
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: "var(--color-light-background)",
      color: "var(--color-light-dark)",
      borderTop: `1px solid var(--color-light-secondary)`,
    },
  },
};
