import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;
  selectedProductId$!: Observable<number | null>;

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
    this.selectedProductId$ = this.productService.selectedProductId$;
  }

  selectProduct(id: number): void {
    this.productService.setSelectedProductId(id);
  }
}
