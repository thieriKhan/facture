import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { User } from '../containers';
import {finalize} from 'rxjs/operators';
import { Router } from '@angular/router';


export interface Token{
  token : string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isLogin;
  baseUrl = 'http://ec2-35-180-31-148.eu-west-3.compute.amazonaws.com:1446';

  token: string;
  private user: User;

  constructor(private http: HttpClient,
     private alertController: AlertController,
      private loadingCtrl: LoadingController,
       private route: Router, private  storage: StorageService) { }


   async login(loginForm){
     this.route.navigate(['nav-bar']);

      let token: string;
       const load =  await this.loadingCtrl.create(
         {
           cssClass: 'loadingClass',
           spinner: 'bubbles'
         }
       );
       await load.present();
      // const url = 'http://192.168.8.100:8000/api/login/';

      const url = this.baseUrl+'/api/v1/Auth/token/';

      const form = loginForm.value;
      const myHeader = new HttpHeaders()
      // .set('Content-Type', 'text')
  .set('Access-Control-Allow-Origin', '*');

      console.log(myHeader);
      const send =this.http.post<any>(url, form,{headers: myHeader} );




      return   send.pipe(
        finalize(
          () =>{
            load.dismiss();
          }
      )).subscribe(
       async  (data)=> {
         this.isLogin = true;
         token =  JSON.stringify(data.token);
        const userData = JSON.stringify(data);

         await this.storage.set('token', token);
         await this.storage.set('user', data.firstName);
         await this.storage.set('userData', userData);
         this.route.navigate(['nav-bar']);



      },
     async  (error: HttpErrorResponse) => {
        let message = 'umknown error';
        console.log('network error:', error , error.error, error.message, error.status, error.headers, error.url, error.type)


        if(error.status === 400 || error.status === 401){
          message = 'identifiant ou mot de passe incorect';
        }else if (error.status === 500){
          message= 'l\'erreur vient du serveur ';
        }
        const alert = await this.alertController.create({
          header: 'ERREUR',
          cssClass: 'alertError',
          message
        });
        await alert.present();
        setTimeout(
         async ()=>{
            await alert.dismiss();
          }, 2000
        );
      }
      );


  }

  async logout(){
    try{
     await  this.storage.remove('token');
     this.isLogin = false;
      this.route.navigate(['/login']);
    }catch(error: any){
      return 0;
    }

  }

}
