import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError } from '@angular/material/input';
import { FormControlsService, FormInput, InputBase } from '@shared/form-input';
import { ComponentWithForm } from '@shared/modal/models/component-with-form';

@Component({
  selector: 'app-edit-info-form',
  imports: [ReactiveFormsModule, MatError, FormInput],
  templateUrl: './edit-info-form.html',
  styleUrls: ['./edit-info-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditInfoForm implements ComponentWithForm {
  #formControlsService = inject(FormControlsService);

  controlsInfo = input<InputBase<string>[]>([]);
  errorMessage = input<string>('');

  form = computed(() => this.#formControlsService.toFormGroup(this.controlsInfo()));
}
