import { HttpErrorResponse } from '@angular/common/http';
import { FailureAction } from './enums';

export interface StateError {
  action: FailureAction;
  data?: unknown;
  error: HttpErrorResponse | string;
}
