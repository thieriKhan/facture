import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
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

  token: string;
  private user: User;

  constructor(private http: HttpClient,
     private alertController: AlertController,
      private loadingCtrl: LoadingController,
       private route: Router, private  storage: StorageService) { }


   async login(loginForm){
      let token: string;
       const load =  await this.loadingCtrl.create();
       await load.present();
      const url = 'http://192.168.8.100:8000/api/login/';
      const form = loginForm.value;
      const send =this.http.post<any>(url, form);



      return   send.pipe(
        finalize(
          () =>{
            load.dismiss();

          }
      )).subscribe(
       async  (data)=> {
         this.isLogin = true;

         token =  JSON.stringify(data);

         await this.storage.set('token', token);
         await this.storage.set('user', loginForm.get('username').value);
         this.route.navigate(['nav-bar']);



      },
     async  (error: any) => {
        let message = 'umknown error';

        if(error.status === 400){
          message = error.error.message;
        }else if (error.status === 500){
          message= 'internal server error';
        }
        const alert = await this.alertController.create({
          header: 'ERROR',
          cssClass: '.myclass{ color: red}',
          subHeader: 'retry',
          message
        });
        await alert.present();
        setTimeout(
         async ()=>{
            await alert.dismiss();
          }, 1000
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
