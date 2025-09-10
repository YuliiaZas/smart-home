import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, OnInit, model } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';
import { Router } from '@angular/router';
import { Auth, LoginRequestInfo } from '@core/auth';
import { ERROR_MESSAGES, ROUTING_PATHS } from '@shared/constants';
import { Spinner } from '@shared/components';
import { LoadingStatus } from '@shared/models';
import { BaseForm, FormControlsError } from '@shared/form';
import { LoginFormService } from './services';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Spinner, BaseForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private loginFormService = inject(LoginFormService);
  private authService = inject(Auth);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  invalidErrorMessage = ERROR_MESSAGES.formValidation.invalidCredentials;
  defaultErrorMessage = ERROR_MESSAGES.defaultError;

  isLoading = toSignal(this.authService.isTokenLoading$);

  loginControlsInfo = this.loginFormService.getInputsData();

  errorMessage = signal('');
  isDataInvalid = signal(false);
  globalControlsErrors = model<FormControlsError | null>(null);

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
    this.markIsDataInvalid(false);
  }

  login(value: LoginRequestInfo) {
    this.authService
      .login(value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate([ROUTING_PATHS.DASHBOARD]));
  }

  private markIsDataInvalid(isInvalid: boolean) {
    if (this.isDataInvalid() === isInvalid) return;

    this.isDataInvalid.set(isInvalid);

    this.globalControlsErrors.set({
      errors: isInvalid ? { defaultError: true } : null,
      controlNames: this.loginControlsInfo.map((control) => control.controlKey),
    });
  }
}
