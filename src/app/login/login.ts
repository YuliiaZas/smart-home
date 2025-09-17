import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, OnInit, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { isEqual } from 'lodash';
import { ERROR_MESSAGES, ROUTING_PATHS } from '@shared/constants';
import { Spinner } from '@shared/components';
import { LoadingStatus } from '@shared/models';
import { BaseForm, FormControlsError } from '@shared/form';
import { executeWithDestroy } from '@shared/utils';
import { Auth, LoginRequestInfo, SignupRequestInfo } from '@core/auth';
import { LoginFormService } from '@core/services';

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
  #loginFormService = inject(LoginFormService);
  #authService = inject(Auth);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);

  #invalidErrorMessage = ERROR_MESSAGES.formValidation.invalidCredentials;
  #defaultErrorMessage = ERROR_MESSAGES.defaultError;

  isLoading = toSignal(this.#authService.isTokenLoading$);

  loginControlsInfo = this.#loginFormService.getInputsData();
  signupControlsInfo = this.#loginFormService.getInputsDataForSignup();

  isSignup = signal(false);
  isDataInvalid = signal(false);

  loginErrorMessage = signal<string>('', { equal: isEqual });
  signupErrorMessage = signal<string>('', { equal: isEqual });

  #loginGlobalErrorControlNames = computed(() => this.loginControlsInfo.map((control) => control.controlKey));
  #signupGlobalErrorControlNames = computed(() => [this.signupControlsInfo[0].controlKey]);
  loginGlobalControlsErrors = signal<FormControlsError | null>(null, { equal: isEqual });
  signupGlobalControlsErrors = signal<FormControlsError | null>(null, { equal: isEqual });

  ngOnInit() {
    executeWithDestroy(
      combineLatest([
        this.#authService.tokenLoadingStatus$.pipe(map((status) => status === LoadingStatus.Failure)),
        this.#authService.invalidCredentials$,
      ]),
      this.#destroyRef,
      ([isFailure, invalidCredentials]) => this.#handleLoginFailure(isFailure, invalidCredentials)
    );
  }

  setIsSignup(isSignup: boolean) {
    this.isSignup.set(isSignup);
    this.#setErrorMessage('', isSignup);
    this.#markIsDataInvalid(false, isSignup);
  }

  formFocus() {
    const isSignup = this.isSignup();
    this.#setErrorMessage('', isSignup);
    this.#markIsDataInvalid(false, isSignup);
  }

  login(value: LoginRequestInfo) {
    executeWithDestroy(this.#authService.login(value), this.#destroyRef, () =>
      this.#router.navigate([ROUTING_PATHS.DASHBOARD])
    );
  }

  signup(value: SignupRequestInfo) {
    executeWithDestroy(this.#authService.signup(value), this.#destroyRef, () =>
      this.#router.navigate([ROUTING_PATHS.DASHBOARD])
    );
  }

  #markIsDataInvalid(isInvalid: boolean, isSignup: boolean) {
    this.loginGlobalControlsErrors.set({
      errors: !isSignup && isInvalid ? { defaultError: true } : null,
      controlNames: this.#loginGlobalErrorControlNames(),
    });
    this.signupGlobalControlsErrors.set({
      errors: isSignup && isInvalid ? { defaultError: true } : null,
      controlNames: this.#signupGlobalErrorControlNames(),
    });
  }

  #setErrorMessage(message: string, isSignup: boolean) {
    this.loginErrorMessage.set(isSignup ? '' : message);
    this.signupErrorMessage.set(isSignup ? message : '');
  }

  #handleLoginFailure(isFailure: boolean, invalidCredentials: boolean) {
    this.isDataInvalid.set(isFailure);
    const isSignup = this.isSignup();

    if (isFailure && invalidCredentials) {
      this.#setErrorMessage(this.#invalidErrorMessage(isSignup), isSignup);
      this.#markIsDataInvalid(true, isSignup);
      return;
    }
    this.#setErrorMessage(isFailure ? this.#defaultErrorMessage : '', isSignup);
  }
}
