export interface IErrorMessage {
  path: string;
  message: string;
}

export type ErrorMessage = IErrorMessage;

export interface StandardErrorResponse {
  success: boolean;
  message: string;
  errorMessages: IErrorMessage[];
}
