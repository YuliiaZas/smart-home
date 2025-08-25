import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { DialogData } from '@shared/modal/services/modal';

@Component({
  selector: 'app-modal-dialog',
  imports: [MatButtonModule, MatDialogModule, A11yModule],
  templateUrl: './modal-dialog.html',
  styleUrl: './modal-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialog {
  data = inject<DialogData>(MAT_DIALOG_DATA);
}
