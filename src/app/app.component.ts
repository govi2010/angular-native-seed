import { Component, OnInit } from '@angular/core';
// vendor dependencies
import { Store } from '@ngrx/store';
import { AppState } from './store';
import { GeneralService } from './services/general.service';
import { GeneralActions } from './actions/general/general.actions';
import { CompanyActions } from './actions/company/company.action';
import 'rxjs/add/operator/distinctUntilChanged'
// app

@Component({
    moduleId: module.id,
    selector: 'maestro-app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    constructor(private store: Store<AppState>, private _generalService: GeneralService,
        private _generalActions: GeneralActions, private _companyActions: CompanyActions) {

    }

    ngOnInit(): void {
        this.store.select(s => s.session).distinctUntilChanged((x, y) => {
            return x.userLoginState === y.userLoginState
        }).subscribe(ss => {
            console.log('key changed');
            if (ss.user) {
                this._generalService.user = ss.user.user;
                this.store.dispatch(this._generalActions.setCountriesWithCodes());
                this.store.dispatch(this._generalActions.getStatesData());
                if (ss.user.statusCode !== 'AUTHENTICATE_TWO_WAY') {
                    this._generalService.sessionId = ss.user.session.id;
                }
            } else {
                this._generalService.user = null;
                this._generalService.sessionId = null;
            }
            this._generalService.companyUniqueName = ss.companyUniqueName;
            // this.store.dispatch(this._companyActions.getTax());
        });
    }
}
