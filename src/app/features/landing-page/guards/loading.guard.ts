import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingGuard implements CanActivate {
  constructor(private loadingService: LoadingService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.loadingService.show();

    // Delay navigation by 1000ms to show splash screen
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        this.loadingService.hide();
        resolve(true);
      }, 800);
    });
  }
}
