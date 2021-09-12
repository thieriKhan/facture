/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap, map, shareReplay, finalize, retry } from 'rxjs/operators';
import { LoadingController, ToastController } from '@ionic/angular';

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
  pending: number;
  customerBSub: BehaviorSubject<Client[]> = new BehaviorSubject([]);



  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private loadC: LoadingController,
    private route: Router,
    private toastC : ToastController
  ) {}


  // recuperer tous les clients

  async getClient(): Promise<Observable<Partial<Client[]>>>{
    this.baseUrl = await  this.storage.get('url');
    const url = this.baseUrl+'/api/v1/customers/';
    const token = await  this.storage.get('token');

    if(token == null){
      this.route.navigate(['login']);

    }
   const credential = JSON.parse(token);

   const auth =  new HttpHeaders({Authorization: 'Token '+credential});

  //  const auth =  new HttpHeaders()
  //  .set('Content-Type', 'application/json')
  //  .set('Authorization', 'Bearer '+credential);
  return this.http.get<Partial<Client[]>>(url,   {headers :auth }).pipe(

    shareReplay()
  );
 }


 // ajouter un  client

  async addClient(data): Promise<Observable<Partial<Client[]>>>{
    this.baseUrl = await  this.storage.get('url');
    const url = this.baseUrl+'/api/v1/customers/';
    const token = await  this.storage.get('token');

    if(token == null){
      this.route.navigate(['login']);

    }
   const credential = JSON.parse(token);

   const auth =  new HttpHeaders({Authorization: 'Token '+credential});

  //  const auth =  new HttpHeaders()
  //  .set('Content-Type', 'application/json')
  //  .set('Authorization', 'Bearer '+credential);
  return this.http.post<Partial<Client[]>>(url,data,   {headers :auth }).pipe(

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
    const errorToast =  await this.toastC.create({
      message: 'desole la rquette n\'as pas ete transmise pour raison inconue. '
        ,
        duration: 5000,
        cssClass: 'errorToast'
    }

    );

    const load =  await this.loadC.create(
      {
        cssClass: 'loadingClass',
        spinner: 'bubbles'
      }
    );
    load.present();
    this.baseUrl = await this.storage.get('url');
    const url = this.baseUrl+'/api/v1/sales';
    const token = await  this.storage.get('token');

    // controler si le token existe toujours et est valide
    if(token == null){
      this.route.navigate(['login']);
    }
   const credential = JSON.parse(token);
  //  const auth =  new HttpHeaders()
  //  .set('Content-Type', 'application/json')
  //  .set('Authorization', 'Bearer '+credential);
    const auth =  new HttpHeaders({Authorization: 'Token '+credential});

  return this.http.post(url, form,{headers :auth } )
  .pipe(
    retry(3),
    finalize(()=> load.dismiss()),
    catchError( async (error)=>{
      errorToast.present();
      load.dismiss();

     const  state = JSON.parse( await  this.storage.get('unposted'))|| [];
       state.push(form);
       await this.storage.set('unposted',    JSON.stringify(state));
       throw error;
    })

  );
 }


// ------------------------------------------------ANCIENNE IMPLEMENTATION--------------------------------------------------
// supprimer une facture

async deleteFacture(id){
  const url = this.baseUrl + '/facturation/'+id;
  const token = await  this.storage.get('token');
  // controler si le token existe toujour et est valide
  if(token == null){
    this.route.navigate(['login']);
  }

  const credential = JSON.parse(token);
  const auth =  new HttpHeaders({Authorization: 'Token '+credential});
  return this.http.delete(url, {headers :auth });
}






}
