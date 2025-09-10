import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, OnInit, model } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Auth, LoginRequestInfo, SignupRequestInfo } from '@core/auth';
import { ERROR_MESSAGES, ROUTING_PATHS } from '@shared/constants';
import { Spinner } from '@shared/components';
import { LoadingStatus } from '@shared/models';
import { BaseForm, FormControlsError } from '@shared/form';
import { LoginFormService } from './services';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatButtonModule, Spinner, BaseForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.signup-mode]': 'isSignup()',
  },
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
  signupControlsInfo = this.loginFormService.getInputsDataForSignup();

  isSignup = signal(false);
  isDataInvalid = signal(false);

  loginErrorMessage = model('');
  signupErrorMessage = model('');
  loginGlobalControlsErrors = model<FormControlsError | null>(null);
  signupGlobalControlsErrors = model<FormControlsError | null>(null);

  ngOnInit() {
    combineLatest([
      this.authService.tokenLoadingStatus$.pipe(map((status) => status === LoadingStatus.Failure)),
      this.authService.invalidCredentials$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([isFailure, invalidCredentials]) => {
        this.isDataInvalid.set(isFailure);
        const isSignup = this.isSignup();
        if (isFailure && invalidCredentials) {
          this.setErrorMessage(this.invalidErrorMessage(isSignup), isSignup);
          this.markIsDataInvalid(true, isSignup);
          return;
        }
        this.setErrorMessage(isFailure ? this.defaultErrorMessage : '', isSignup);
      });
  }

  setIsSignup(isSignup: boolean) {
    this.isSignup.set(isSignup);
    this.setErrorMessage('', isSignup);
    this.markIsDataInvalid(false, isSignup);
  }

  formFocus() {
    this.setErrorMessage('');
    this.markIsDataInvalid(false, this.isSignup());
  }

  login(value: LoginRequestInfo) {
    this.authService
      .login(value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate([ROUTING_PATHS.DASHBOARD]));
  }

  signup(value: SignupRequestInfo) {
    this.authService
      .signup(value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate([ROUTING_PATHS.DASHBOARD]));
  }

  private markIsDataInvalid(isInvalid: boolean, isSignup?: boolean) {
    if (isSignup) {
      this.loginGlobalControlsErrors.set(null);
      this.signupGlobalControlsErrors.set({
        errors: isInvalid ? { defaultError: true } : null,
        controlNames: [this.loginControlsInfo[0].controlKey],
      });
    } else {
      this.loginGlobalControlsErrors.set({
        errors: isInvalid ? { defaultError: true } : null,
        controlNames: this.loginControlsInfo.map((control) => control.controlKey),
      });
      this.signupGlobalControlsErrors.set(null);
    }
  }

  private setErrorMessage(message: string, isSignup?: boolean) {
    if (isSignup) {
      this.loginErrorMessage.set('');
      this.signupErrorMessage.set(message);
    } else {
      this.loginErrorMessage.set(message);
      this.signupErrorMessage.set('');
    }
  }
}
