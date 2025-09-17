import { AbstractControl, FormGroup, FormsModule } from '@angular/forms';
import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  DestroyRef,
  ChangeDetectionStrategy,
  effect,
  viewChild,
  OnInit,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOption, MatSelect } from '@angular/material/select';
import { getValidationErrorMessage } from '@shared/validation';
import { Spinner } from '@shared/components';
import { executeWithDestroy, isObjectKey } from '@shared/utils';
import { SafeHtmlPipe } from '@shared/pipes';
import { InputBase, InputType, OptionInfo, PasswordDataInfo } from '@shared/form/models';
import { passwordDataMap } from '@shared/form/constants';

@Component({
  selector: 'app-form-input',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelect,
    MatOption,
    MatChipsModule,
    MatAutocompleteModule,
    SafeHtmlPipe,
    Spinner,
  ],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInput<T, TKey extends string = string, TOption = T> implements OnInit {
  #parentContainer = inject(ControlContainer);
  #destroyRef = inject(DestroyRef);
  #announcer = inject(LiveAnnouncer);
  inputType = InputType;

  inputData = input.required<InputBase<T, TKey, TOption>>();

  formControl: AbstractControl | null = null;

  matAutocomplete = viewChild<MatAutocomplete>('auto');

  currentElementType = linkedSignal(() => this.#getType(this.inputData().controlType));

  errorMessage = signal<string>('', { equal: (a, b) => a === b });

  currentPasswordState = computed<PasswordDataInfo | null>(() => {
    const currentType = this.currentElementType();
    return isObjectKey(currentType, passwordDataMap) ? passwordDataMap[currentType] : null;
  });

  readonly selectedItemIds = linkedSignal<TOption[]>(() => {
    const value = this.inputData().value;
    return value && Array.isArray(value) ? value : [];
  });
  readonly allOptions = signal<OptionInfo<TOption>[]>([]);
  readonly isLoadingOptions = signal(false);
  readonly currentSearch = signal('');
  readonly filteredOptions = computed(() => {
    const currentSearch = this.currentSearch();
    const allOptions = this.allOptions();
    return this.#getFilteredOptions(currentSearch, allOptions);
  });

  constructor() {
    effect(() => {
      const inputData = this.inputData();
      this.#resolveOptions(inputData);
    });
  }

  ngOnInit() {
    if (!this.formControl) {
      const formGroup = this.#parentContainer.control as FormGroup;
      this.formControl = formGroup?.get(this.inputData().controlKey) || null;
    }

    executeWithDestroy(
      merge(...[this.formControl?.valueChanges, this.formControl?.statusChanges].filter(Boolean)),
      this.#destroyRef,
      () => this.errorMessage.set(getValidationErrorMessage(this.formControl!, this.inputData().validationErrorOptions))
    );
  }

  togglePasswordVisibility(event: MouseEvent) {
    if (this.inputData().controlType !== InputType.PASSWORD) return;
    const currentType = this.currentElementType();
    this.currentElementType.set(currentType === InputType.PASSWORD ? InputType.TEXT : InputType.PASSWORD);
    event.stopPropagation();
  }

  getOptionItem(itemId: TOption): OptionInfo<TOption> | undefined {
    return this.allOptions().find((item) => item.id === itemId);
  }

  selectedChip(event: MatAutocompleteSelectedEvent): void {
    const currentValue = [...this.selectedItemIds(), event.option.value];

    this.selectedItemIds.set(currentValue);
    this.formControl?.setValue(currentValue);

    event.option.deselect();
    this.currentSearch.set('');
  }

  addChip(event: MatChipInputEvent) {
    this.currentSearch.set('');
    const value = (event.value || '').trim();
    if (!value) return;

    const matAutocomplete = this.matAutocomplete();
    if (matAutocomplete && matAutocomplete.options.length > 0) {
      matAutocomplete._emitSelectEvent(matAutocomplete.options.first);
    }
  }

  removeChip(itemIndex: number, selectedOptionItem?: OptionInfo<TOption>) {
    const currentValue = [...this.selectedItemIds()];
    currentValue.splice(itemIndex, 1);

    this.selectedItemIds.set(currentValue);
    this.formControl?.setValue(currentValue);

    this.#announcer.announce(`Removed ${selectedOptionItem?.label || 'item'}`);
  }

  #getFilteredOptions(currentSearch: string, allOptions: OptionInfo<TOption>[]): OptionInfo<TOption>[] {
    if (!currentSearch) return allOptions;
    return allOptions.filter((option) => option.label.toLowerCase().includes(currentSearch.trim().toLowerCase()));
  }

  #resolveOptions(inputData: InputBase<T, TKey, TOption>) {
    if (inputData.hasSyncOptions()) {
      this.allOptions.set(inputData.options || []);
    } else if (inputData.hasAsyncOptions()) {
      this.isLoadingOptions.set(true);

      executeWithDestroy(
        inputData.optionsAsync!,
        this.#destroyRef,
        (options) => {
          this.allOptions.set(options);
          this.isLoadingOptions.set(false);
        },
        (error) => {
          console.error('Error loading async options:', error);
          this.allOptions.set([]);
          this.isLoadingOptions.set(false);
        }
      );
    }
  }

  #getType(inputType: InputType): HTMLInputElement['type'] {
    switch (inputType) {
      case InputType.PASSWORD: {
        return 'password';
      }
      default: {
        return 'text';
      }
    }
  }
}
