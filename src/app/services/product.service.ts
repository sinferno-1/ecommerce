// product.service.ts
// API wrapper around Fake Store endpoints. Also handles in-memory
// augmentation like currency conversion, tag generation and keeping
// locally added products persisted in localStorage.
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

export const USD_TO_INR = 83;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Base URL for fake store API
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) { }

  /**
   * Fetch all products from the API and merge with locally added
   * products stored in localStorage.
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(products => {
        const transformed = products.map(product => this.transformProduct(product));
        // merge any locally saved products
        const local = this.getLocalProducts();
        return [...local, ...transformed];
      })
    );
  }

  /**
   * Fetch a single product by id from the API, transforming it to our
   * internal Product type.
   */
  getProduct(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(product => this.transformProduct(product))
    );
  }

  /**
   * Create a new product by POSTing to the API. The API returns the
   * created object which we also store locally so that subsequent
   * getProducts() calls include it.
   */
  addProduct(product: Partial<Product>): Observable<Product> {
    // attempt to post to the API; if it fails we still create a local
    // product so the UI shows it immediately.
    return this.http.post<any>(this.apiUrl, product).pipe(
      map(p => {
        const transformed = this.transformProduct(p);
        this.saveLocalProduct(transformed);
        return transformed;
      })
    );
    // Note: error handling is left to caller; client components may
    // catch errors and create local-only entries when needed.
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

  /**
   * Return products the user has added locally stored in localStorage.
   * We keep a separate array under key 'addedProducts'.
   */
  private getLocalProducts(): Product[] {
    const json = localStorage.getItem('addedProducts');
    if (!json) return [];
    try {
      return JSON.parse(json) as Product[];
    } catch {
      return [];
    }
  }

  /**
   * Persist a newly created product in localStorage so it shows up
   * in future fetches.
   */
  /**
   * Persist a newly created product in localStorage so it shows up
   * in future fetches. Public wrapper so components can call directly
   * when API call fails.
   */
  public addLocalProduct(product: Product) {
    const existing = this.getLocalProducts();
    existing.unshift(product); // newest first
    localStorage.setItem('addedProducts', JSON.stringify(existing));
  }

  private saveLocalProduct(product: Product) {
    // internal call used when API succeeds
    this.addLocalProduct(product);
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
