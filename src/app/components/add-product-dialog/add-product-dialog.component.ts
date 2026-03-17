// add-product-dialog.component.ts
// Dialog used to collect details for a new product. Opened from PLP.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { debounceTime, startWith, map } from 'rxjs/operators';



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
    MatButtonModule,
    MatAutocompleteModule
  ]
})
export class AddProductDialogComponent implements OnInit {
  productForm: FormGroup;
  categories: string[] = [];
  filteredCategories: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private fb: FormBuilder,
    private productService: ProductService
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

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filteredCategories = categories;
      },
      error: () => {
        this.categories = [];
        this.filteredCategories = [];
      }
    });

    this.productForm.get('category')?.valueChanges.pipe(
      startWith<string>(''),
      debounceTime(100),
      map((value: string) => this._filterCategories(value || ''))
    ).subscribe((filtered) => {
      this.filteredCategories = filtered;
    });
  }

  private _filterCategories(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(category =>
      category.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Close the dialog returning form value to caller.
   */
  /**
   * Close the dialog returning the form data if validation passes.
   */
  save() {
    if (this.productForm.valid) {
      const category = this.productForm.get('category')?.value?.trim();
      if (category && !this.categories.some(c => c.toLowerCase() === category.toLowerCase())) {
        this.productService.addLocalCategory(category);
      }

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