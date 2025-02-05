import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private selectedProductIdSubject = new BehaviorSubject<number | null>(null);
  selectedProductId$ = this.selectedProductIdSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    // 从 localStorage 恢复选中的商品 ID
    const savedProductId = localStorage.getItem('selectedProductId');
    if (savedProductId) {
      this.selectedProductIdSubject.next(Number(savedProductId));
    }
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  setSelectedProductId(id: number | null): void {
    this.selectedProductIdSubject.next(id);
    if (id) {
      localStorage.setItem('selectedProductId', id.toString());
    } else {
      localStorage.removeItem('selectedProductId');
    }
  }
}
