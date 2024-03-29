import { SaleProductRequest } from './../../../../../../../api/stock-api/src/models/interfaces/product/SaleProductRequest';
import { GetAllProductsResponse } from './../../../../models/interfaces/products/response/GetAllProductsResponse';
import { CreateProductRequest } from './../../../../models/interfaces/products/request/CreateProductRequest';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];
  public productAction!: {
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
  };
  public productSelectedDatas!: GetAllProductsResponse;
  public productDatas: Array<GetAllProductsResponse> = [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required],
  });

  public saleProductSeleted!: GetAllProductsResponse;
  public renderDropDown = false;

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;
  public dialogRef!: DynamicDialogRef;

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private productDtService: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data;

    if (this.productAction?.event?.action === this.saleProductAction) {
      this.getProductDatas();
    }

    this.getAllCategories();
    this.renderDropDown = true;
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;

            if (
              this.productAction?.event?.action === this.editProductAction &&
              this.productAction?.productDatas
            ) {
              this.getProductSelectedDatas(
                this.productAction?.event?.id as string
              );
            }
          }
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount),
      };

      this.productService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso',
              life: 2500,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto',
              life: 2500,
            });
          },
        });

      this.addProductForm.reset();
    }
  }

  handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction.event.id,
        amount: this.editProductForm.value.amount as number,
        category_id: this.editProductForm.value.category_id as string,
      };

      this.productService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso',
              life: 2500,
            });
            this.editProductForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'erro',
              summary: 'Erro',
              detail: 'Error ao editar produto',
              life: 2500,
            });
            this.editProductForm.reset();
          },
        });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  handleSubmitSaleProduct(): void {
    if (this.saleProductForm?.value && this.saleProductForm.valid) {
      const requestDatas: SaleProductRequest = {
        amount: this.saleProductForm.value.amount as number,
        product_id: this.saleProductForm.value.product_id as string,
      };

      this.productService
        .saleProduct(requestDatas)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.saleProductForm.reset();
            this.getProductDatas();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Venda efetuada com sucesso!',
              life: 2500,
            });
            this.closeDialog();
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.saleProductForm.reset();
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Error ao vender o produto!',
              life: 2500,
            });
          },
        });
    }
  }

  getProductSelectedDatas(product_id: string): void {
    const allProducts = this.productAction?.productDatas;

    if (allProducts.length > 0) {
      const productFiltered = allProducts.filter(
        (element) => element?.id === product_id
      );

      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0];
        console.log(this.productSelectedDatas);

        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          description: this.productSelectedDatas?.description,
          amount: this.productSelectedDatas?.amount,
          category_id: this.productSelectedDatas?.category.id,
        });
      }
    }
  }

  getProductDatas(): void {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productDatas = response;
            response && this.productDtService.setProductsDatas(response);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
