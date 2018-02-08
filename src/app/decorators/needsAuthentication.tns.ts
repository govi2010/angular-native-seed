import { AppState } from '../store';
import { CanActivate } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginActions } from '../actions/login/login.action';
import { createSelector } from 'reselect';

@Injectable()
export class NeedsAuthentication implements CanActivate {
  constructor(private store: Store<AppState>, private routerExtensions: RouterExtensions, private _loginActions: LoginActions) {
  }

  public canActivate() {
    let data = false;
    return this.store.select(createSelector([(p: AppState) => p.session], (s) => {
      if (s && s.user) {
        return true;
      } else {
        this.routerExtensions.navigateByUrl('/login', { clearHistory: true });
        // this.routerExtensions.navigate(['/login']);
        return false;
      }

    }));
    // return data;
  }
}
