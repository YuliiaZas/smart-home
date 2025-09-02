import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NOTIFICATION_MESSAGES } from '@shared/constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  #snackBar = inject(MatSnackBar);

  show(message: string, actionButtonText?: string, duration?: number) {
    this.#snackBar.open(message, actionButtonText || NOTIFICATION_MESSAGES.actionButtonText, {
      duration: duration ?? NOTIFICATION_MESSAGES.duration,
    });
  }
}
