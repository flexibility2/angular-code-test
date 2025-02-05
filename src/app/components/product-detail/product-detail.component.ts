import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, map, finalize, of } from 'rxjs';

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
  isDetailLoading = false;

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.isOpen$ = this.productService.selectedProductId$.pipe(map(id => id !== null));

    this.selectedProduct$ = this.productService.selectedProductId$.pipe(
      switchMap(id => {
        if (id === null) {
          return of(null);
        }
        this.isDetailLoading = true;
        return this.productService.getProduct(id).pipe(
          finalize(() => {
            this.isDetailLoading = false;
          }),
        );
      }),
    );
  }

  closeDetail(): void {
    this.productService.setSelectedProductId(null);
  }
}
