import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Auth, LoginRequestInfo } from '@shared/auth';
import { ERROR_MESSAGES, ROUTING_PATHS } from '@shared/constants';
import { MatButton } from '@angular/material/button';
import { Spinner } from '@shared/components';
import { getValidationErrorMessage } from '@shared/validation';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AsyncPipe, MatFormFieldModule, MatInputModule, MatIcon, MatButton, Spinner],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  invalidErrorMessage = ERROR_MESSAGES.formValidation.invalidCredentials;

  readonly isLoading$ = this.authService.isTokenLoading$;

  loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(2)]],
  });

  hidePassword = signal(true);
  isDataInvalid = signal(false);

  username = this.loginForm.controls.username;
  password = this.loginForm.controls.password;

  ngOnInit() {
    this.authService.areCredentialsInvalid$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((areInvalid) => {
      this.markIsDataInvalid(areInvalid);
    });
  }

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

    this.authService
      .login(loginRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate([ROUTING_PATHS.DASHBOARD]));
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  getErrorMessage(formControl: FormControl): string {
    return getValidationErrorMessage(formControl, { skipDefaultError: true });
  }

  private markIsDataInvalid(isInvalid: boolean) {
    this.isDataInvalid.set(isInvalid);
    if (isInvalid) {
      this.username.setErrors({ invalidCredentials: true });
      this.password.setErrors({ invalidCredentials: true });
    } else {
      this.username.setErrors(null);
      this.password.setErrors(null);
    }
  }
}
