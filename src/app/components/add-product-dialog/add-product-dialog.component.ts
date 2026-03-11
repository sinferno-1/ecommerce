// add-product-dialog.component.ts
// Dialog used to collect details for a new product. Opened from PLP.
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Dialog window used by ProductListComponent to collect information
 * for a new product. The dialog simply returns the form data when
 * the user clicks "Save".
 */
@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
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
  save() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}