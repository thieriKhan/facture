/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { catchError,tap, map, shareReplay } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

import { Client, Facture } from '../containers';


@Injectable({
  providedIn: 'root'
})
export class FacturesService {
  baseUrl = 'http://ec2-35-180-31-148.eu-west-3.compute.amazonaws.com:1446';
  printItemID: string[]= [];
  selectedclient;
  currentClient;
  progres = 0;
  allCurentsOrders: Facture[];



  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private loadC: LoadingController,
    private route: Router
  ) {}

// recuperer toutes les factures

  async getFacture<Facture>(client): Promise<Observable<any>>{
     const url = this.baseUrl + '/facturation/'+client;
     const token = await  this.storage.get('token');
     if(token == null){
      this.route.navigate(['login']);
    }
    const credential = JSON.parse(token);

    const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
   return this.http.get(url,   {headers :auth}).pipe(
     map((val: any) => val.resp ),
     shareReplay()
   );
  }
  // recuperer tous les clients

  async getClient(): Promise<Observable<Partial<Client[]>>>{
    const url = this.baseUrl+'/api/v1/customers';
    const token = await  this.storage.get('token');

    if(token == null){
      this.route.navigate(['login']);

    }
   const credential = JSON.parse(token);

   const auth =  new HttpHeaders()
   .set('Content-Type', 'application/json')
   .set('Authorization', 'Bearer '+credential);
  return this.http.get<Partial<Client[]>>(url,   {headers :auth }).pipe(

    shareReplay()
  );
 }


   //  recupperer tous les produits du backend
   async getProduit(): Promise<Observable<any>>{
    const url = '/api/v1/stock';
    const token = await  this.storage.get('token');
    if(token == null){
      this.route.navigate(['login']);
    }
   const credential = JSON.parse(token);

   const auth =  new HttpHeaders()
   .set('Authorization', 'Bearer '+credential);
  return this.http.get(url,   {headers :auth}).pipe(

    shareReplay()
  );
  }



//  recuperer les donnees d'un client
async getUniqueClient(id: string){
  return (await this.getClient()).pipe(

    map((data: Client[])=>  data.find((item)=> item.id ===  parseInt(id) ).name),

  );
}



// ajouter une facture dans le backend
  async postFacture(form): Promise<Observable<any>>{
    const url = this.baseUrl+'/api/v1/sales';
    const token = await  this.storage.get('token');

    // controler si le token existe toujours et est valide
    if(token == null){
      this.route.navigate(['login']);
    }
   const credential = JSON.parse(token);
   const auth =  new HttpHeaders()
   .set('Content-Type', 'application/json')
   .set('Authorization', 'Bearer '+credential);

  return this.http.post(url, form,{headers :auth } );
 }


// modifier une facture

 async updateFacture(id, quantite): Promise<Observable<any>>{

  const url = this.baseUrl +  '/facturation/'+id;
  const token = await  this.storage.get('token');
  // contoler si le token existe toujours et est valide
  if(token == null){
    this.route.navigate(['login']);
  }
  const form = {  quantite} ;
 const credential = JSON.parse(token);
 const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
return this.http.put(url, form,{headers :auth } );
}


// supprimer une facture

async deleteFacture(id){
  const url = this.baseUrl + '/facturation/'+id;
  const token = await  this.storage.get('token');
  // controler si le token existe toujour et est valide
  if(token == null){
    this.route.navigate(['login']);
  }

  const credential = JSON.parse(token);
  const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
  return this.http.delete(url, {headers :auth });
}

}
