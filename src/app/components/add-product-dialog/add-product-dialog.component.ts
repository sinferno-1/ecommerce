// add-product-dialog.component.ts
// Dialog used to collect details for a new product. Opened from PLP.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

/**
 * Dialog window used by ProductListComponent to collect information
 * for a new product. The dialog simply returns the form data when
 * the user clicks "Save".
 */
@Component({
  standalone: true,
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AddProductDialogComponent {
  productForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private fb: FormBuilder
  ) {
    // build a simple form with required fields
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  /**
   * Close dialog returning form value to caller.
   */
  /**
   * Close the dialog returning the form data if validation passes.
   */
  save() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  /**
   * Dismiss the dialog without returning data.
   */
  cancel() {
    this.dialogRef.close();
  }
}