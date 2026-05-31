import axios from "axios";

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Backend room-type module uses `totalPage` instead of `totalPages`. */
export interface PaginatedResultAlt<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export function normalizePagination<T>(
  result: PaginatedResult<T> | PaginatedResultAlt<T>,
): PaginatedResult<T> {
  return {
    data: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: "totalPages" in result ? result.totalPages : result.totalPage,
  };
}

export function getErrorMessage(error: unknown, fallback = "Đã có lỗi xảy ra"): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Không kết nối được API. Mở terminal trong thư mục api, chạy npm run dev (port 3001), rồi thử lại.";
    }
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) return message;
    if (Array.isArray(message)) return message.join(", ");
  }
  if (error instanceof Error && error.message === "Network Error") {
    return "Không kết nối được API. Mở terminal trong thư mục api, chạy npm run dev (port 3001), rồi thử lại.";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
