import { InputBase } from '@shared/form';
import { Observable } from 'rxjs';

export interface FormSubmissionConfig<TFormValue> {
  initDataId?: string | ((data: TFormValue) => string);
  submitHandler: (formValue: TFormValue & { id: string }) => void;
  successObservable?: Observable<void>;
  errorObservable?: Observable<string | null>;
}

export interface FormCancellationConfig {
  cancelHandler?: () => void;
}

export interface FormModalConfig<TFormValue> extends FormSubmissionConfig<TFormValue>, FormCancellationConfig {
  title: string;
  controlsInfo: InputBase<TFormValue[keyof TFormValue]>[];
}
