import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TaxResponse } from '../../../models/api-models/Company';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { CompanyActions } from '../../../actions/company/company.action';
import { LoaderService } from '../../../services/loader.service';
import { MyDrawerItem } from '../../../shared/my-drawer-item/my-drawer-item';
import { MyDrawerComponent } from '../../../shared/my-drawer/my-drawer.component';
@Component({
    selector: 'ns-taxes',
    moduleId: module.id,
    templateUrl: './taxes.component.html'
})
export class TaxesComponent implements OnInit, OnDestroy {
    public navItemObj$: Observable<MyDrawerItem[]>;
    @ViewChild('myDrawer') public myDrawer: MyDrawerComponent;
    public taxList$: Observable<TaxResponse[]>;
    public isTaxLoading$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _companyActions: CompanyActions, private _loaderService: LoaderService) {
        this.store.dispatch(this._companyActions.getTax());
        this.taxList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);
        this.isTaxLoading$ = this.store.select(p => p.company.isTaxesLoading).takeUntil(this.destroyed$);
        this.navItemObj$ = this.store.select(p => p.general.navDrawerObj).map(p => {
            for (const iterator of p) {
                if (iterator.router) {
                    if (iterator.router === '/dashboard') {
                        iterator.isSelected = true;
                    } else {
                        iterator.isSelected = false;
                    }
                }
            }
            return p;
        }).takeUntil(this.destroyed$);
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

    public toggleDrawer() {
        this.myDrawer.toggle();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
