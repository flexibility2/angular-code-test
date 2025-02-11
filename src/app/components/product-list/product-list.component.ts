import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  loading = true;
  @ViewChildren('productItem') productItems!: QueryList<ElementRef>;

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.products$ = this.productService.getProducts().pipe(
      finalize(() => {
        this.loading = false;
      }),
    );
    this.selectedProductId$ = this.productService.selectedProductId$;

    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.productService.setSelectedProductId(Number(productId));
      }
    });
  }

  ngAfterViewInit(): void {
    // wait data is loaded
    combineLatest([this.products$, this.selectedProductId$, this.productItems.changes])
      .pipe(
        filter(([products, id]) => products.length > 0 && id !== null),
        take(1), // only run once
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
    // update the URL
    this.router.navigate(['products', id]);
  }
}
