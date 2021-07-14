import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.page.html',
  styleUrls: ['./nav-bar.page.scss'],
})
export class NavBarPage implements OnInit {
  user: string;

  constructor(private storage: StorageService,
    private log: LoginService
  ) {

  }

  ngOnInit() {
  }
 async ionViewWillEnter(){
    this.user = await this.storage.get('user');
  }

  logout(){
    this.log.logout();
  }

}
