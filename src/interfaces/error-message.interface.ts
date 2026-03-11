export interface ErrorMessage {
  path: string;
  message: string;
}

export interface StandardErrorResponse {
  success: boolean;
  message: string;
  errorMessages: ErrorMessage[];
}
