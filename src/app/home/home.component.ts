import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VerifyEmailResponseModel } from '../models/api-models/loginModels';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { LoginActions } from '../actions/login/login.action';
import { Router } from '@angular/router';
import { CompanyActions } from '../actions/company/company.action';
import { CompanyResponse } from '../models/api-models/Company';
import { MyDrawerItem } from '../shared/my-drawer-item/my-drawer-item';
import { createSelector } from 'reselect';
import { RouterService } from '../services/router.service';
import { ToasterService } from '../services/toaster.service';

@Component({
    selector: 'ns-home',
    moduleId: module.id,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    public logoutIcon: string = String.fromCharCode(0xf073);
    @ViewChild("drawer") drawerComponent: any;
    private _sideDrawerTransition: any;
    public userStream$: Observable<VerifyEmailResponseModel>;
    public userName: string;
    public activeCompany: CompanyResponse;
    public companyData$: Observable<{ companies: CompanyResponse[], uniqueName: string }>
    public companies: MyDrawerItem[] = [];
    constructor(private store: Store<AppState>, private routerExtensions: RouterService, private _loginActions: LoginActions,
        private _companyActions: CompanyActions, private _toaster: ToasterService) {
        this.userStream$ = this.store.select(s => s.session.user);
        this.companyData$ = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
            return { companies, uniqueName };
        }));
    }

    public ngOnInit(): void {
        this.store.dispatch(this._companyActions.refreshCompanies());

        this.companyData$.subscribe(res => {
            if (!res.companies) {
                return;
            }
            let allCmps: MyDrawerItem[] = [];
            res.companies.forEach(cmp => {
                let item = new MyDrawerItem();
                item.title = cmp.name;
                item.needTopHr = true;
                item.fontFamily = 'FontAwesome';
                item.customData = cmp;
                if (cmp.uniqueName === res.uniqueName) {
                    item.icon = String.fromCharCode(0xf00c);
                    item.isSelected = true;
                }

                allCmps.push(item);
            });
            this.companies = allCmps;

            this.activeCompany = res.companies.find(cmp => {
                return cmp.uniqueName === res.uniqueName;
            });

        });

        this.userStream$.subscribe(u => {
            if (u && u.user) {
                let userEmail = u.user.email;
                if (u.user.name.match(/\s/g)) {
                    let name = u.user.name;
                    let tmpName = name.split(' ');
                    this.userName = tmpName[0][0] + tmpName[1][0];
                } else {
                    this.userName = u.user.name[0] + u.user.name[1];
                }
            }
        })
    }
    public get sideDrawerTransition(): any {
        return this._sideDrawerTransition;
    }

    public ngOnDestroy(): void {
        // this.lo
    }

    public goTo(route: string[]) {
        (this.routerExtensions.router as any).navigate(route);
    }

    public onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }

    public logout() {

        this._toaster.confirm({
            title: 'Logout',
            message: 'Are you sure you want to logout?',
            okButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(r => {
            if (r) {
                this.store.dispatch(this._loginActions.logout());
                (this.routerExtensions.router as any).navigateByUrl('/login', { clearHistory: true });
            }
        });
    }

    public changeCompany(item: MyDrawerItem) {
        this.store.dispatch(this._companyActions.changeCompany(item.customData.uniqueName));
        this.drawerComponent.sideDrawer.toggleDrawerState();
    }
}
