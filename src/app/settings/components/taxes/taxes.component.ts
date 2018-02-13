import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TaxResponse } from '../../../models/api-models/Company';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { CompanyActions } from '../../../actions/company/company.action';
import { LoaderService } from '../../../services/loader.service';
@Component({
    selector: 'ns-taxes',
    moduleId: module.id,
    templateUrl: './taxes.component.html'
})
export class TaxesComponent implements OnInit, OnDestroy {
    public taxList$: Observable<TaxResponse[]>;
    public isTaxLoading$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _companyActions: CompanyActions, private _loaderService: LoaderService) {
        this.store.dispatch(this._companyActions.getTax());
        this.taxList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);
        this.isTaxLoading$ = this.store.select(p => p.company.isTaxesLoading).takeUntil(this.destroyed$);
    }

    public ngOnInit(): void {
        this.isTaxLoading$.subscribe(s => {
            if (s) {
                this._loaderService.show();
            } else {
                this._loaderService.hide();
            }
        })
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
