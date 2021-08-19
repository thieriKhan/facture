import { ClientOrder } from './../containers';

import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, retry, shareReplay, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Produit } from '../containers';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  allProducts: Produit[];
  total  = 0;
  currentClient;
  currentClintid;
  allCurrentClientsOrders: ClientOrder[]= [];
  baseUrl = 'http://ec2-35-180-31-148.eu-west-3.compute.amazonaws.com:1446';

constructor(private http: HttpClient, private route: Router, private storage: StorageService) {

 }


async getProduit(): Promise<Observable<any>>{
  const url = this.baseUrl+'/api/v1/stock/';
  const token = await  this.storage.get('token');
  if(token == null){
    this.route.navigate(['login']);
  }
 const credential = JSON.parse(token);


 const auth =  new HttpHeaders()
 .set('Authorization', 'Bearer '+credential);
return this.http.get(url,   {headers :auth}).pipe(
  retry(10),
  shareReplay()
);
}

}
