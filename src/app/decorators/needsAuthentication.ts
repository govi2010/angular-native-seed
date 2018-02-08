import { AppState } from '../store';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginStateEnum } from '../models/other-models/HelperModels';
import { createSelector } from 'reselect';


@Injectable()
export class NeedsAuthentication implements CanActivate {
    constructor(public _router: Router, private store: Store<AppState>) {
    }

    public canActivate() {
        let data = false;
        return this.store.select(createSelector([(p: AppState) => p.session], (s) => {
            if (s && s.user) {
                return true;
            } else {
                this._router.navigate(['/login']);
                // this.routerExtensions.navigate(['/login']);
                return false;
            }
        }));
    }
}
