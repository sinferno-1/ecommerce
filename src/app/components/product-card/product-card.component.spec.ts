import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductCardComponent, RouterTestingModule]
    });
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = {
      id: 1,
      title: 'Test Product',
      price: 100,
      priceInr: 8300,
      mrp: 9000,
      discount: 5,
      description: 'Test',
      category: 'electronics',
      mappedCategory: 'Tech',
      image: 'https://example.com/image.png',
      rating: { rate: 4.5, count: 10 },
      tags: ['bestseller'],
      inStock: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
