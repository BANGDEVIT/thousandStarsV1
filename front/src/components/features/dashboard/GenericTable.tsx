import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  keyExtractor: (row: T) => string;
  toolbar?: React.ReactNode;
}

export function GenericTable<T>({
  columns,
  data,
  loading,
  page = 1,
  totalPages = 1,
  onPageChange,
  keyExtractor,
  toolbar,
}: Props<T>) {
  return (
    <div className="flex flex-col gap-4">
      {toolbar && <div className="flex items-center gap-3">{toolbar}</div>}

      <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-100">
            <tr className="border-b border-slate-100 text-left text-slate-500">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="border-b border-slate-50 transition-colors hover:bg-slate-50"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-left">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="cursor-pointer rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40"
            aria-label="Trang trước"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm text-slate-500">{page} / {totalPages}</span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
            className="cursor-pointer rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40"
            aria-label="Trang sau"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
