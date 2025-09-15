import { HttpErrorResponse } from '@angular/common/http';

export function isHttpError(error: unknown): error is HttpErrorResponse {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function isError(error: unknown): error is Error {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export function getErrorValue(error: unknown): HttpErrorResponse | string {
  if (isHttpError(error)) {
    return error;
  } else if (isError(error)) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unknown error occurred';
  }
}

export function getErrorValueString(error: unknown): string {
  if (isHttpError(error) || isError(error)) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unknown error occurred';
  }
}
