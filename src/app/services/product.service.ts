import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, catchError } from 'rxjs';

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
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  // Mock数据
  private mockProducts: Product[] = [
    {
      id: 1,
      title: '男士休闲夹克',
      price: 109.95,
      description: '时尚修身的男士休闲夹克，采用优质面料，适合各种场合穿着。',
      category: '男装',
      image: 'https://picsum.photos/id/1/400/600',
    },
    {
      id: 2,
      title: '女士真皮手提包',
      price: 199.99,
      description: '精致优雅的真皮手提包，内部空间宽敞，是商务和日常使用的理想选择。',
      category: '配饰',
      image: 'https://picsum.photos/id/2/400/600',
    },
    {
      id: 3,
      title: '智能手表',
      price: 299.99,
      description: '多功能智能手表，支持心率监测、运动追踪等功能，续航持久。',
      category: '电子产品',
      image: 'https://picsum.photos/id/3/400/600',
    },
    {
      id: 4,
      title: '运动跑鞋',
      price: 159.99,
      description: '专业运动跑鞋，采用减震技术，提供极致舒适的运动体验。',
      category: '运动',
      image: 'https://picsum.photos/id/4/400/600',
    },
  ];

  constructor(private readonly http: HttpClient) {
    // 从 localStorage 恢复选中的商品 ID
    const savedProductId = localStorage.getItem('selectedProductId');
    if (savedProductId) {
      this.selectedProductIdSubject.next(Number(savedProductId));
    }
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API调用失败，使用mock数据', error);
        return of(this.mockProducts);
      }),
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API调用失败，使用mock数据', error);
        const mockProduct = this.mockProducts.find(p => p.id === id);
        if (!mockProduct) {
          throw new Error('找不到商品');
        }
        return of(mockProduct);
      }),
    );
  }

  setSelectedProductId(id: number | null): void {
    this.selectedProductIdSubject.next(id);
    if (id) {
      localStorage.setItem('selectedProductId', id.toString());
    } else {
      localStorage.removeItem('selectedProductId');
    }
  }

  setLoading(loading: boolean): void {
    this.isLoadingSubject.next(loading);
  }
}
