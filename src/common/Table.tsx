import React from "react";

export type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
  width?: number | string;
};

export type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
};

export function Table<T extends object>({
  columns,
  data,
  className = "",
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-[#009FE3] border-b border-[#009FE3]/20 uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`py-2 ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
                }`}
                style={col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`py-2 ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                  style={col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : undefined}
                >
                  {col.render ? col.render(row) : (row[col.key] as any)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
