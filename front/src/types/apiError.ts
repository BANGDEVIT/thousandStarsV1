export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface ApiError {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
  message?: string;
}
