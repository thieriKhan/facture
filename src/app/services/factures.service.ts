/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { catchError, finalize,tap, map, shareReplay } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

import { Facture } from '../containers';


@Injectable({
  providedIn: 'root'
})
export class FacturesService {
  baseUrl = 'http://192.168.8.100:8000/api';
  printItemID: string[]= [];
  selectedclient;
  currentClient;

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
     tap((resp)=>{
       console.log('fact', resp);
     }),

     shareReplay()
   );
  }

// recuperer tous les clients

  async getClient(): Promise<Observable<any>>{
    const url = this.baseUrl+'/client/';
    const token = await  this.storage.get('token');
    if(token == null){
      this.route.navigate(['login']);

    }
   const credential = JSON.parse(token);

   const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
  return this.http.get(url,   {headers :auth }).pipe(
    map((val: any) => val),
    shareReplay()
  );
 }

//  recuperer les donnees d'un client

 async getUniqueClient(id): Promise<Observable<any>>{
  const url = this.baseUrl +'/client/'+id;
  const token = await  this.storage.get('token');
  if(token == null){
    this.route.navigate(['login']);
  }
 const credential = JSON.parse(token);

 const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
return this.http.get(url,   {headers :auth }).pipe(
  map((val: any) => val.nom),
  shareReplay()
);
}
  //  recupperer tous les produits du backend
 async getProduit(): Promise<Observable<any>>{
  const url = this.baseUrl + '/produit/';
  const token = await  this.storage.get('token');
  if(token == null){
    this.route.navigate(['login']);
  }
 const credential = JSON.parse(token);

 const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
return this.http.get(url,   {headers :auth}).pipe(
  map((val: any) => val),
  shareReplay()
);
}



// ajouter une facture dans le backend
  async postFacture(form): Promise<Observable<any>>{
    const load = await this.loadC.create();
     load.present();
    const url = this.baseUrl+'/facture/';
    const token = await  this.storage.get('token');
    if(token == null){
      this.route.navigate(['login']);
    }
   const credential = JSON.parse(token);


   const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
  return this.http.post(url, form,{headers :auth } ).pipe(
    finalize(
      ()=>{ load.dismiss(); }
    )
  );
 }


// modifier une facture

 async updateFacture(id, quantite): Promise<Observable<any>>{
  const load = await this.loadC.create();
   load.present();
  const url = this.baseUrl +  '/facturation/'+id;
  const token = await  this.storage.get('token');
  if(token == null){
    this.route.navigate(['login']);
  }
  const form = {'quantite': quantite}
 const credential = JSON.parse(token);
 const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
return this.http.put(url, form,{headers :auth } ).pipe(

  finalize(
    ()=>{ load.dismiss(); }
  )
);
}


// supprimer une facture

async deleteFacture(id){
  const url = this.baseUrl + '/facturation/'+id;
  const token = await  this.storage.get('token');
  if(token == null){
    this.route.navigate(['login']);

  }

  const credential = JSON.parse(token);
  const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
  return this.http.delete(url, {headers :auth });
}

}
