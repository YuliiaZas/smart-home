import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';
import { Router } from '@angular/router';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Auth, LoginRequestInfo } from '@shared/auth';
import { ERROR_MESSAGES, ROUTING_PATHS } from '@shared/constants';
import { Spinner } from '@shared/components';
import { LoadingStatus } from '@shared/models';
import { FormControlsService, FormInput } from '@shared/form-input';
import { LoginFormService } from './login-form.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatError, MatButtonModule, Spinner, FormInput],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private loginFormService = inject(LoginFormService);
  private formControlsService = inject(FormControlsService);
  private authService = inject(Auth);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  invalidErrorMessage = ERROR_MESSAGES.formValidation.invalidCredentials;
  defaultErrorMessage = ERROR_MESSAGES.defaultError;

  isLoading = toSignal(this.authService.isTokenLoading$);

  loginFormInfo = this.loginFormService.getInputsData();
  loginForm = this.formControlsService.toFormGroup(this.loginFormInfo);

  errorMessage = signal('');
  isDataInvalid = signal(false);

  ngOnInit() {
    combineLatest([
      this.authService.tokenLoadingStatus$.pipe(map((status) => status === LoadingStatus.Failure)),
      this.authService.invalidCredentials$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([isFailure, invalidCredentials]) => {
        if (isFailure && invalidCredentials) {
          this.errorMessage.set(this.invalidErrorMessage);
          this.markIsDataInvalid(true);
          return;
        }
        this.errorMessage.set(isFailure ? this.defaultErrorMessage : '');
      });
  }

  formFocus() {
    this.errorMessage.set('');
    if (this.isDataInvalid()) {
      this.markIsDataInvalid(false);
    }
  }

  login() {
    this.authService
      .login(this.loginForm.getRawValue() as LoginRequestInfo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate([ROUTING_PATHS.DASHBOARD]));
  }

  private markIsDataInvalid(isInvalid: boolean) {
    this.isDataInvalid.set(isInvalid);
    if (isInvalid) {
      this.setFormGroupErrors({ defaultError: true });
    } else {
      this.setFormGroupErrors(null);
    }
  }

  private setFormGroupErrors(errors: Record<string, boolean> | null) {
    for (const controlName of Object.keys(this.loginForm.controls)) {
      const control = this.loginForm.get(controlName);
      if (control) {
        control.setErrors(errors);
      }
    }
  }
}
