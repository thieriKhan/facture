import { PrintPreviewComponent } from './../impression-facture/print-preview/print-preview.component';
/* eslint-disable @typescript-eslint/naming-convention */
import { LoginService } from './../services/login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AlertController, LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FacturesService } from '../services/factures.service';
import {  Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {  Facture , PostData} from '../containers';
import { HttpClient } from '@angular/common/http';
import { PopoverComponent } from '../components/popover/popover.component';



@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.page.html',
  styleUrls: ['./nav-bar.page.scss'],
})
export class NavBarPage implements OnInit, OnDestroy {
  user: string;
  deleteSub: Subscription;
  updateSub: Subscription;
  postSub: Subscription;
  start= 0;

  constructor(private storage: StorageService,
    private fact: FacturesService,
    private alertC: AlertController,
    private router: Router,
    private toastC: ToastController,
    private loadC: LoadingController,
    private log: LoginService,
    private http: HttpClient,
    private popoverC: PopoverController,

  ) {

  }

  ngOnInit() {}

 async  showPopOver(ev: any){
    const popover = await this.popoverC.create({
      component: PopoverComponent,
      cssClass: 'popover-class',
      event: ev,
      translucent: true

    });
    await popover.present();
  }
 async ionViewWillEnter(){
    this.user = await this.storage.get('user');
  }



async ionViewDidEnter(){
    const toast = await this.toastC.create({
      message: 'vous etes hors ligne',
      duration: 2000
    });
    const toast2 = await this.toastC.create({
      message: 'connexion etablie',
      duration: 2000
    });

    window.addEventListener('offline', (event)=>{
      toast.present();
    });

    window.addEventListener('online',async  ()=>{

      this.http.get('http://api.github.com').subscribe(

        async ()=>{
          toast2.present();
          const failedPost: PostData[] =JSON.parse(await  this.storage.get('unposted'))|| [];
          if(failedPost.length > 0){
            this.failedPosted(failedPost);
          }

      },
        (error)=>{toast.present();}
      );

        // toutes les requettes updates echouees
    //  const failedUpdate = JSON.parse(await this.storage.get('unupdated'))|| [];

    //  if(failedUpdate.length > 0){
    //    this.failedUpdated(failedUpdate);
    //  }
    //   //  toutes les requettes deletes echouees
    //   const failedDelete = JSON.parse(await this.storage.get('undeleted'))|| [];
    //   if (failedDelete.length > 0){
    //   this.failedDeleted(failedDelete);
    //   this.start = this.fact.progres;
    //   }
    });


  }



  // async failedUpdated(data: UpdateFacture[]){

  //   if(data.length > 0){
  //     for( let i = 0 ; i < data.length ; i++){
  //       this.updateSub = ( await this.fact.updateFacture(data[i].id , data[i].quantite)).subscribe(
  //         async (val)=> {
  //           data.splice(i);
  //         }
  //       );
  //       await this.storage.set('unupdated',    JSON.stringify(data));
  //     }

  //   }

  // }



  // async failedDeleted(data: number[]){
  //     for( let i = 0 ; i < data.length ; i++){
  //       this.deleteSub = ( await this.fact.deleteFacture(data[i])).subscribe(
  //         async (val)=> {
  //           this.fact.progres += 1/data.length;
  //           data.splice(i);
  //           await this.storage.set('undeleted', JSON.stringify(data)  );

  //         }
  //       );
  //       this.fact.progres = 0;
  //     }

  // }



  async failedPosted(data: PostData[]){

    if(data.length > 0){


      for( let i = 0 ; i < data.length ; i++){
        this.postSub =  (await this.fact.postFacture(data[i])).subscribe(
          async (val)=> {
            this.fact.progres += 1/data.length;
            console.log('b',data);
            data.splice(i, 1);
            console.log('a',data);
           await  this.storage.set('unposted',    JSON.stringify(data));
          }
        );

      }


    }

  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.deleteSub.unsubscribe();
    this.updateSub.unsubscribe();
  }

}
