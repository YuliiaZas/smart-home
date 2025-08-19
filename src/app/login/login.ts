import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, finalize, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Auth, LoginRequestInfo } from '@shared/auth';
import { ERROR_MESSAGES, ROUTING_PATHS } from '@shared/constants';
import { MatButtonModule } from '@angular/material/button';
import { Spinner } from '@shared/components';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    Spinner,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  invalidErrorMessage = ERROR_MESSAGES.login.invalid;

  readonly isLoading$ = new BehaviorSubject<boolean>(false);

  loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(2)]],
  });

  hidePassword = signal(true);
  isDataInvalid = signal(false);

  username = this.loginForm.controls.username;
  password = this.loginForm.controls.password;

  formFocus() {
    if (this.isDataInvalid()) {
      this.markIsDataInvalid(false);
    }
  }

  login() {
    const loginRequest: LoginRequestInfo = {
      userName: this.username.value,
      password: this.password.value,
    };

    this.isLoading$.next(true);

    this.authService
      .login(loginRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          if (error.status === 401) {
            this.markIsDataInvalid(true);
            return of();
          }
          throw error;
        }),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe(() => this.router.navigate([ROUTING_PATHS.DASHBOARD]));
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  getErrorMessage(formControl: FormControl): string {
    if (formControl.hasError('required')) {
      return ERROR_MESSAGES.login.required;
    }
    if (formControl.hasError('minlength')) {
      return ERROR_MESSAGES.login.minlength(formControl.getError('minlength').requiredLength);
    }
    return '';
  }

  private markIsDataInvalid(isInvalid: boolean) {
    this.isDataInvalid.set(isInvalid);
    if (isInvalid) {
      this.username.setErrors({ invalidValue: true });
      this.password.setErrors({ invalidValue: true });
    } else {
      this.username.setErrors(null);
      this.password.setErrors(null);
    }
  }
}
