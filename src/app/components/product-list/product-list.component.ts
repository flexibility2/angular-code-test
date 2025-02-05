import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, take, finalize } from 'rxjs/operators';

import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products$!: Observable<Product[]>;
  selectedProductId$!: Observable<number | null>;
  @ViewChildren('productItem') productItems!: QueryList<ElementRef>;

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.productService.setLoading(true);
    this.products$ = this.productService.getProducts().pipe(
      finalize(() => {
        this.productService.setLoading(false);
      }),
    );
    this.selectedProductId$ = this.productService.selectedProductId$;
  }

  ngAfterViewInit(): void {
    // 等待商品数据加载完成和选中ID都准备好
    combineLatest([this.products$, this.selectedProductId$, this.productItems.changes])
      .pipe(
        filter(([products, id]) => products.length > 0 && id !== null),
        take(1), // 只执行一次
      )
      .subscribe(([_, id]) => {
        const element = this.productItems.find(item => item.nativeElement.id === `product-${id}`);
        if (element) {
          element.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      });
  }

  selectProduct(id: number): void {
    this.productService.setSelectedProductId(id);
  }
}
