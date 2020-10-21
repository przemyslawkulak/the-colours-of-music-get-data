// TODO check if not change interface

export interface ErrorResponse {
  reload?: boolean;
  title?: string;
  type?: ErrorResponseType;
  summary?: string;
  messages?: ErrorResponseMessage[];
}

export enum ErrorResponseType {
  Info = 'Info',
  Error = 'Error',
  Validation = 'Validation',
}

export interface ErrorResponseMessage {
  field: string;
  value: string;
}
