import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component,OnInit, ViewChild,OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './model/product';
import { ProductService } from './service/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  title = 'AngularHttpRequest';
  allProducts:Product[]=[];
  isFetching:boolean=false;
  @ViewChild('productsForm')
  form :NgForm;
  editMode:boolean=false;
  currentProductId:string;
  errorMessage:string=null;
  errorSub:Subscription;
  constructor(private service:ProductService){}
  ngOnInit(){
    this.fetchProducts();
    this.errorSub=this.service.error.subscribe((err)=>this.errorMessage=err);
  }
  ngOnDestroy(){
    this.errorSub.unsubscribe();
    
  }
  onProductsFetch(){
    this.fetchProducts();
  }
  onProductCreate(product:{pName:string,desc:string,price:string}){
    if(!this.editMode){
      this.service.createProduct(product).subscribe((res)=>{
        this.fetchProducts();
        this.form.reset();
      });
    }else{
      this.service.updateproduct(this.currentProductId,product).subscribe((res)=>{
        this.fetchProducts();
        this.form.reset();
      });
    }

  }
  private fetchProducts(){
    this.isFetching=true;
    this.service.fetchProducts().subscribe((products)=>{
      this.allProducts=products;
      this.isFetching=false;
    }),(err)=>{
      this.errorMessage=err.message;
    };
  }
  onDeleteProduct(id:string){
    this.service.deleteProduct(id).subscribe((res)=>{
      this.fetchProducts();
    });
  

  }
  onEditClicked(id:string){
    this.currentProductId=id;
    // Get the product based on the id
    let currentProduct = this.allProducts.find(p=>p.id===id);
    // Populate the form with the product details
    this.form.setValue({
      pName:currentProduct.pName,
      desc:currentProduct.desc,
      price:currentProduct.price
  });
    // Change the button value to update product
    this.editMode=true;
  }
  onDeleteAllProducts(){
    this.service.deleteAllProducts().subscribe((res)=>{
      this.fetchProducts();
    });
  }
  
}
