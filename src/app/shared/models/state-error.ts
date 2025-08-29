import { FailureAction } from './failure-action.enum';

export interface StateError {
  action: FailureAction;
  data?: unknown;
  error: Error;
}
