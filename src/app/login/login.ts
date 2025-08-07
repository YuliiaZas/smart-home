import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Auth, LoginRequestInfo } from '@shared/auth';
import { ROUTING_PATHS } from '@shared/constants';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIcon],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

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
    this.authService.login(loginRequest).subscribe({
      next: () => this.router.navigate([ROUTING_PATHS.DASHBOARD]),
      error: (error) => {
        if (error.status === 401) {
          this.markIsDataInvalid(true);
        }
      },
    });
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  getErrorMessage(formControl: FormControl): string {
    if (formControl.hasError('required')) {
      return 'This field is required';
    }
    if (formControl.hasError('minlength')) {
      return `Minimum length is ${formControl.getError('minlength')?.requiredLength}`;
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
