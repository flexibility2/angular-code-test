import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, map } from 'rxjs';

import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  selectedProduct$!: Observable<Product | null>;
  isOpen$!: Observable<boolean>;

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.selectedProduct$ = this.productService.selectedProductId$.pipe(
      switchMap(id => {
        if (id === null) {
          return new Observable<null>(subscriber => subscriber.next(null));
        }
        return this.productService.getProduct(id);
      }),
    );

    this.isOpen$ = this.productService.selectedProductId$.pipe(map(id => id !== null));
  }

  closeDetail(): void {
    this.productService.setSelectedProductId(null);
  }
}
