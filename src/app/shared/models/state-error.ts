import { FailureAction } from './enums';

export interface StateError {
  action: FailureAction;
  data?: unknown;
  error: Error;
}
