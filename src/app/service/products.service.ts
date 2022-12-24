import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError} from "rxjs/operators";
import { Product } from "../model/product";

@Injectable({providedIn:"root"})
export class ProductService{
    private readonly  URL:string="https://angularbyme-6a0d0-default-rtdb.firebaseio.com/products";
    error = new Subject<string>();
    constructor(private http:HttpClient){}

    createProduct(product:{pName:string,desc:string,price:string}){
        const headers= new HttpHeaders({'myHeader':'MyApp'});
        return this.http.post<{name:string}>(this.URL+'.json'
        ,product,{headers:headers});

        /*this.http.post<{name:string}>(this.URL+'.json'
        ,product,{headers:headers}).subscribe((res)={
          console.log(res);
        },(err)=>{
          this.error.next(err.message);
        });*/

    }
    fetchProducts(){
      const header= new HttpHeaders()
      .set('content-type','application/json')
      .set('access-Control-Allow-Origin','*');

      const params = new HttpParams()
      .set('print','pretty').set('pageNum',1);
        return this.http.get<{[key:string]:Product}>(this.URL+'.json',{headers:header,params:params})
        .pipe(map((res)=>{
          const products=[];
          for(const key in res){
            if(res.hasOwnProperty(key)){
              products.push({...res[key],id:key});
            }
          }
          return products;
        },catchError((err)=>{
          // write logic for logging error
          console.log(err);
          return throwError(()=>new Error(err));
        })));
    }
    deleteProduct(id:string){
      let header = new HttpHeaders();
      header= header.append('myHeader1','Value1');
      header= header.append('myHeader2','Value2');
        return this.http.delete(this.URL+'/'+id+'.json',{headers:header});
    }
    deleteAllProducts(){
        return this.http.delete(this.URL+'.json');
    }
    updateproduct(id:string,value:Product){
      return this.http.put(this.URL+'/'+id+'.json',value);
    }
}