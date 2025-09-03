import { AbstractControl, FormGroup, FormsModule } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOption, MatSelect } from '@angular/material/select';
import { getValidationErrorMessage } from '@shared/validation';
import { isObjectKey } from '@shared/utils';
import { InputType, OptionInfo, PasswordDataInfo } from './models';
import { InputBase } from './typed-inputs/input-base';
import { passwordDataMap } from './constants/password-data-map';

@Component({
  selector: 'app-form-input',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelect,
    MatOption,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class FormInput implements AfterViewInit, OnInit {
  #parentContainer = inject(ControlContainer);
  #destroyRef = inject(DestroyRef);
  #announcer = inject(LiveAnnouncer);
  inputType = InputType;

  inputData = input.required<InputBase<string>>();

  formControl: AbstractControl | undefined | null;

  currentElementType = linkedSignal(() => this.#getType(this.inputData().controlType));

  currentPasswordState = computed<PasswordDataInfo | null>(() => {
    const currentType = this.currentElementType();
    return isObjectKey(currentType, passwordDataMap) ? passwordDataMap[currentType] : null;
  });

  readonly selectedItemIds = linkedSignal(() => {
    const value = this.inputData().value;
    return (typeof value === 'string' ? [value] : value) || [];
  });
  readonly allOptions = model<OptionInfo[]>([]);
  readonly isLoadingOptions = model(false);
  readonly currentSearch = model('');
  readonly filteredOptions = computed(() => this.#getFilteredOptions());

  get #parentContainerForm() {
    return this.#parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.#resolveOptions();
  }

  ngAfterViewInit() {
    this.formControl = this.#parentContainerForm?.get(this.inputData().controlKey);
  }

  getErrorMessage(): string {
    if (!this.formControl) return '';
    return getValidationErrorMessage(this.formControl, this.inputData().validationErrorOptions);
  }

  togglePasswordVisibility(event: MouseEvent) {
    if (this.inputData().controlType !== InputType.PASSWORD) return;
    const currentType = this.currentElementType();
    this.currentElementType.set(currentType === InputType.PASSWORD ? InputType.TEXT : InputType.PASSWORD);
    event.stopPropagation();
  }

  getOptionItem(itemId: string): OptionInfo | undefined {
    return this.allOptions().find((item) => item.id === itemId);
  }

  selectedChip(event: MatAutocompleteSelectedEvent): void {
    this.selectedItemIds.update((selectedIds) => [...selectedIds, event.option.value]);
    this.currentSearch.set('');
    event.option.deselect();
  }

  addChip() {
    this.currentSearch.set('');
  }

  removeChip(itemIndex: number, selectedOptionItem?: OptionInfo) {
    this.selectedItemIds.update((selectedItems) => {
      return selectedItems.filter((_, index) => index !== itemIndex);
    });
    this.#announcer.announce(`Removed ${selectedOptionItem?.label || 'item'}`);
  }

  #getFilteredOptions(): OptionInfo[] {
    const currentSearch = this.currentSearch();
    const allOptions = this.allOptions();
    if (!currentSearch) return allOptions;

    return allOptions.filter((option) => option.label.toLowerCase().includes(currentSearch.trim().toLowerCase()));
  }

  #resolveOptions() {
    const inputData = this.inputData();

    if (inputData.hasSyncOptions()) {
      this.allOptions.set(inputData.options || []);
    } else if (inputData.hasAsyncOptions()) {
      this.isLoadingOptions.set(true);
      inputData.optionsAsync!.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
        next: (options) => {
          this.allOptions.set(options);
          this.isLoadingOptions.set(false);
        },
        error: (error) => {
          console.error('Error loading async options:', error);
          this.allOptions.set([]);
          this.isLoadingOptions.set(false);
        },
      });
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
