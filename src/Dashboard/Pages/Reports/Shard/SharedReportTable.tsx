import React from "react";

interface Column {
    header: string;
    accessor: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface SharedReportTableProps {
    data: any[];
    columns: Column[];
    title?: string;
    isLoading?: boolean;
}

const SharedReportTable: React.FC<SharedReportTableProps> = ({
    data,
    columns,
    title,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="w-full p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-gray-100 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[var(--color-bg-light)] rounded-2xl shadow-sm border border-[var(--color-border-light)] overflow-hidden animate-fadeIn">
            {title && (
                <div className="px-6 py-4 border-b border-[var(--color-border-light)] bg-[var(--color-bg-warm)]">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                        {title}
                    </h3>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--color-bg-cream)] text-[var(--color-text-muted)] text-sm uppercase tracking-wider">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 font-medium border-b border-[var(--color-border-medium)]"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-light)]">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="hover:bg-[var(--color-bg-lighter)] transition-colors duration-200"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-6 py-4 text-[var(--color-text-primary)] text-sm"
                                        >
                                            {col.render
                                                ? col.render(row[col.accessor], row)
                                                : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center text-[var(--color-text-muted)]"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SharedReportTable;
