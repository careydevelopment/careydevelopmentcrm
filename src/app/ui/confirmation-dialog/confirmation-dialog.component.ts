import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogModel } from './confirmation-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {

    title: string;
    message: string;

    constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogModel) {
        // Update view with given values
        this.title = data.title;
        this.message = data.message;
    }

    onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close(false);
    }
}
