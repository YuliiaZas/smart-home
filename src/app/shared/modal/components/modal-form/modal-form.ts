import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
  ViewContainerRef,
  OnInit,
  ComponentRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { CustomModalData } from '@shared/modal/models';
import { ComponentWithForm } from '@shared/models';

@Component({
  selector: 'app-modal-form',
  imports: [MatButtonModule, MatDialogModule, A11yModule],
  templateUrl: './modal-form.html',
  styleUrls: ['../modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalForm<TFormValue, TComponent extends ComponentWithForm<TFormValue>> implements OnInit {
  data = inject<CustomModalData<TComponent>>(MAT_DIALOG_DATA);

  dynamicContent = viewChild('dynamicContent', { read: ViewContainerRef });
  dynamicComponent?: ComponentRef<TComponent>;

  #onConfirm$ = new Subject<TFormValue>();

  onConfirm = this.#onConfirm$.asObservable();

  ngOnInit() {
    this.dynamicComponent = this.dynamicContent()?.createComponent(this.data.component, {
      bindings: this.data.componentBindings,
    });
  }

  handleSubmitForm() {
    const formValue = this.dynamicComponent?.instance.handleFormSubmit();
    if (formValue) this.#onConfirm$.next(formValue);
  }
}
