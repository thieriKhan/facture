import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

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



//   async getProduit(produiID): Promise<Observable<any>>{
//     const url = 'http://192.168.8.100:8000/api/produit/?search='+produiID;
//     const token = await  this.storage.get('token');
//    const credential = JSON.parse(token);

//    const auth =  new HttpHeaders({Authorization: 'Token '+credential.token});
//   return this.http.get(url,   {headers :auth});
//  }


}
