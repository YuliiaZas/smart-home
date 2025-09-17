import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
  ViewContainerRef,
  OnInit,
  ComponentRef,
  signal,
  OnDestroy,
} from '@angular/core';
import { Subject, take } from 'rxjs';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { FormModalData, ModalFormInterface } from '@shared/modal/models';
import { ComponentWithForm } from '@shared/models';
import { Spinner } from '@shared/components';

@Component({
  selector: 'app-modal-form',
  imports: [MatButtonModule, MatDialogModule, MatError, A11yModule, Spinner],
  templateUrl: './modal-form.html',
  styleUrls: ['../modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalForm<TFormValue, TComponent extends ComponentWithForm<TFormValue>>
  implements ModalFormInterface<TFormValue, TComponent>, OnInit, OnDestroy
{
  data = inject<FormModalData<TFormValue, TComponent>>(MAT_DIALOG_DATA);

  #dialogRef = inject(MatDialogRef<ModalForm<TFormValue, TComponent>>);
  #destroy$ = new Subject<void>();

  dynamicContent = viewChild('dynamicContent', { read: ViewContainerRef });
  dynamicComponent?: ComponentRef<TComponent>;

  isLoading = signal(false);
  errorMessage = signal('');

  #onConfirm$ = new Subject<TFormValue>();
  onConfirm$ = this.#onConfirm$.asObservable();

  ngOnInit() {
    this.dynamicComponent = this.dynamicContent()?.createComponent(this.data.component, {
      bindings: this.data.componentBindings || [],
    });

    this.#dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => this.#destroy$.next());
  }

  ngOnDestroy() {
    this.#onConfirm$.complete();

    if (this.dynamicComponent) {
      this.dynamicComponent.destroy();
      this.dynamicComponent = undefined;
    }
  }

  handleModalConfirm() {
    const formValue = this.dynamicComponent?.instance.handleFormSubmit();
    if (formValue) {
      this.setError('');
      this.#onConfirm$.next(formValue);
    }
  }

  setLoading(loading: boolean) {
    this.isLoading.set(loading);
  }

  setError(error: string) {
    this.errorMessage.set(error);
  }
}
