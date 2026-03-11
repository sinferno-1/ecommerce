import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  id: number;
  title: string;
  price: number;
  priceInr: number;
  mrp: number;
  discount: number;
  description: string;
  category: string;
  mappedCategory: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  tags: string[];
  inStock: boolean;
}

const USD_TO_INR = 83;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>('https://fakestoreapi.com/products').pipe(
      map(products => products.map(product => this.transformProduct(product)))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<any>(`https://fakestoreapi.com/products/${id}`).pipe(
      map(product => this.transformProduct(product))
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('https://fakestoreapi.com/products/categories');
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<any[]>(`https://fakestoreapi.com/products/category/${category}`).pipe(
      map(products => products.map(product => this.transformProduct(product)))
    );
  }

  private transformProduct(product: any): Product {
    const priceInr = Math.round(product.price * USD_TO_INR);
    const mrp = Math.round(priceInr * 1.2); // Mock MRP as 20% higher
    const discount = Math.round(((mrp - priceInr) / mrp) * 100);
    const mappedCategory = this.mapCategory(product.category);
    const tags = this.generateTags(priceInr, product.rating.rate);
    const inStock = Math.random() > 0.1; // 90% in stock
    return {
      ...product,
      priceInr,
      mrp,
      discount,
      mappedCategory,
      tags,
      inStock
    };
  }

  private mapCategory(apiCategory: string): string {
    const categoryMap: { [key: string]: string } = {
      'electronics': 'Tech',
      'jewelery': 'Fashion',
      "men's clothing": "Men's Fashion",
      "women's clothing": "Women's Fashion"
    };
    return categoryMap[apiCategory] || apiCategory;
  }

  private generateTags(priceInr: number, rating: number): string[] {
    const tags: string[] = [];
    if (priceInr < 999) {
      tags.push('under-999');
    } else if (priceInr <= 2000) {
      tags.push('budget-pick');
    } else {
      tags.push('premium');
    }
    if (rating >= 4.5) {
      tags.push('bestseller');
    }
    return tags;
  }
}
