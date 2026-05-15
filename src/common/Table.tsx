import React from "react";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T, index: number) => React.ReactNode;
  width?: number | string;
  title?: string;
  sortable?: boolean;
  /**
   * Custom sort function. If it accepts a third argument (order), it will be called as (a, b, order: 'asc' | 'desc').
   * Otherwise, fallback to (a, b) and reverse if needed.
   */
  sortFunction?: (a: T, b: T, order?: 'asc' | 'desc') => number;
};

export type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
};

import { useState } from "react";


export function Table<T extends object>({
  columns,
  data,
  className = "",
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fonction de tri générique (hors colonne 'position')
  const sortedData = (() => {
    if (!sortKey) return data;
    const col = columns.find(c => String(c.key) === sortKey);
    if (!col) return data;
    return [...data].sort((a, b) => {
      if (col.sortFunction) {
        // If the function accepts 3 arguments, pass the order
        if (col.sortFunction.length >= 3) {
          return col.sortFunction(a, b, sortOrder);
        } else {
          // Fallback: old behavior, reverse if desc
          return sortOrder === 'asc' ? col.sortFunction(a, b) : -col.sortFunction(a, b);
        }
      }
      let aValue = a[col.key as keyof T];
      let bValue = b[col.key as keyof T];
      if (col.render) {
        aValue = a[col.key as keyof T];
        bValue = b[col.key as keyof T];
      }
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
      if (bValue == null) return sortOrder === 'asc' ? -1 : 1;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortOrder === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      }
      return sortOrder === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  })();

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortKey(null);
        setSortOrder('asc'); // valeur par défaut, peu importe
      }
    } else {
      setSortKey(key);
      const col = columns.find(c => String(c.key) === key);
      // Pour deltaPos, on démarre en 'asc' pour conserver le cycle asc -> desc -> default
      if (col && col.key === 'deltaPos') {
        setSortOrder('asc');
        return;
      }
      let isNumber = false;
      for (let i = 0; i < data.length; i++) {
        const v = data[i][col?.key as keyof T];
        if (typeof v === 'number' || (!isNaN(Number(v)) && v !== null && v !== undefined && v !== '')) {
          isNumber = true;
          break;
        }
      }
      setSortOrder(isNumber ? 'desc' : 'asc');
    }
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left text-gray-300" style={{ tableLayout: 'fixed' }}>
        <thead className="text-[#009FE3] border-b border-[#009FE3]/20 uppercase text-xs">
          <tr>
            <th className="py-2 px-3 text-left" style={{ width: 40, minWidth: 40, maxWidth: 40 }} title="Rank">#</th>
            {columns.map((col) => {
              const isSortable = !!col.sortable;
              const isSorted = sortKey === String(col.key);
              return (
                <th
                  key={String(col.key)}
                  className={`py-2 ${
                    isSortable ? 'cursor-pointer select-none' : ''
                  } ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                  style={col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : undefined}
                  title={col.title ?? col.label}
                  onClick={isSortable ? () => handleSort(String(col.key)) : undefined}
                >
                  {col.label}
                  {isSortable && (
                    <span style={{ marginLeft: 4, fontSize: '0.5em', lineHeight: 1, display: 'inline-block', verticalAlign: 'middle' }}>
                      {isSorted
                        ? (
                            <span style={{ color: '#009FE3' }}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                          )
                        : (
                            <span style={{ color: '#aaa' }}>▲<br />▼</span>
                          )}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, index) => (
            <tr
              key={index}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >
              <td className="py-2 px-3 text-left" style={{ width: 40, minWidth: 40, maxWidth: 40 }}>{index + 1}</td>
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
                  {col.render ? col.render(row, index) : (col.key in row ? row[col.key as keyof T] as any : null)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
