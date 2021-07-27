import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {

  constructor(private route: Router, private storage: StorageService ){}
 async  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean | UrlTree>  {
      const val = await this.storage.get('token') ;
      if(val === null){
        return true;
      }else{
        this.route.navigate(['nav-bar']);
        return false;
      }
  }


  async  canLoad(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean | UrlTree>  {
      const val = await this.storage.get('token') ;
      if(val === null){
        return true;
      }else{
        this.route.navigate(['nav-bar']);
        return false;
      }
  }

}
