import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  constructor(private router: Router) {}

  onCardClick() {
    this.router.navigate(['/product', this.product.id]);
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  getTagColor(tag: string): string {
    switch (tag) {
      case 'under-999':
        return 'primary';
      case 'budget-pick':
        return 'accent';
      case 'premium':
        return 'warn';
      case 'bestseller':
        return 'primary';
      default:
        return '';
    }
  }
}
