import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { catchError, finalize,tap, map, shareReplay } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { timeStamp } from 'console';


@Injectable({
  providedIn: 'root'
})
export class FacturesService {


  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private loadC: LoadingController,
    private route: Router
  ) {}

// recuperer toutes les factures
  async getFacture(client: number): Promise<Observable<any>>{
     const url = 'http://192.168.8.100:8000/api/facturation/'+client;
     const token = await  this.storage.get('token');
     if(token == null){
      this.route.navigate(['login']);
    }
    const credential = JSON.parse(token);

    const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
   return this.http.get(url,   {headers :auth}).pipe(
     map((val: any) => val.resp),

     shareReplay()
   );
  }

// recuperer tous les clients

  async getClient(): Promise<Observable<any>>{
    const url = 'http://192.168.8.100:8000/api/client/';
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
  const url = 'http://192.168.8.100:8000/api/client/'+id;
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
  const url = 'http://192.168.8.100:8000/api/produit/';
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
    const url = 'http://192.168.8.100:8000/api/facture/';
    const token = await  this.storage.get('token');
    if(token == null){
      this.route.navigate(['login']);
    }
   const credential = JSON.parse(token);
   console.log(credential);

   const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
  return this.http.post(url, form,{headers :auth } ).pipe(
    finalize(
      ()=>{ load.dismiss(); }
    )
  );
 }


// modifier une facture

 async updateFacture(id, form): Promise<Observable<any>>{
  const load = await this.loadC.create();
   load.present();
  const url = 'http://192.168.8.100:8000/api/facture/'+id+'/';
  const token = await  this.storage.get('token');
  if(token == null){
    this.route.navigate(['login']);
  }
 const credential = JSON.parse(token);
 const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
return this.http.put(url, form,{headers :auth } ).pipe(

  finalize(
    ()=>{ load.dismiss(); }
  )
);
}



//   async getProduit(produiID): Promise<Observable<any>>{
//     const url = 'http://192.168.8.100:8000/api/produit/?search='+produiID;
//     const token = await  this.storage.get('token');
//    const credential = JSON.parse(token);

//    const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
//   return this.http.get(url,   {headers :auth});
//  }


}
