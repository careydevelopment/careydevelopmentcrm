import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../models/product';


const baseUrl: string = environment.baseProductServiceUrl;

@Injectable({ providedIn: 'root' })
export class ProductService {

  constructor(private http: HttpClient) { }

  fetchAllProducts(): Observable<Product[]> {
    let url = `${baseUrl}/products`;
    console.log("Fetch products URL is " + url);

    return this.http.get<Product[]>(url);
  }
}
