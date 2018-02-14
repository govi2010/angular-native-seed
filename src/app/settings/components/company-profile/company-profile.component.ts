import { OnInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { MyDrawerItem } from "../../../shared/my-drawer-item/my-drawer-item";
import { CompanyResponse, States } from "../../../models/api-models/Company";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IContriesWithCodes } from "../../../shared/static-data/countryWithCodes";
import { ReplaySubject } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { SettingsProfileActions } from "../../../actions/settings/profile/settings.profile.action";
import { LoaderService } from "../../../services/loader.service";
import { RouterService } from "../../../services/router.service";
import { createSelector } from "reselect";
import * as _ from 'lodash';
import { MyDrawerComponent } from "../../../shared/my-drawer/my-drawer.component";


@Component({
    selector: 'ns-company-profile',
    moduleId: module.id,
    templateUrl: './company-profile.component.html',
    styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
    public navItemObj$: Observable<MyDrawerItem[]>;
    @ViewChild('myDrawer') public myDrawer: MyDrawerComponent;
    public selectedCompany$: Observable<CompanyResponse>;
    public companyProfileForm: FormGroup;
    public countrySourceStream$: Observable<IContriesWithCodes[]>
    public isUpdateCompanyProfileInProcess$: Observable<boolean>;
    public isUpdateCompanyProfileSuccess$: Observable<boolean>;
    public stateStream$: Observable<States[]>;
    public currenciesStream$: Observable<string[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _fb: FormBuilder, private _settingsProfileActions: SettingsProfileActions,
        private _loaderService: LoaderService, private routerExtensions: RouterService) {
        this.navItemObj$ = this.store.select(p => p.general.navDrawerObj).map(p => {
            for (const iterator of p) {
                if (iterator.router) {
                    if (iterator.router === '/settings') {
                        iterator.isSelected = true;
                    } else {
                        iterator.isSelected = false;
                    }
                }
            }
            return p;
        });

        this.countrySourceStream$ = this.store.select(s => s.general.contriesWithCodes).takeUntil(this.destroyed$);
        this.stateStream$ = this.store.select(s => s.general.states).takeUntil(this.destroyed$);
        this.selectedCompany$ = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
            if (!companies) {
                return;
            }

            return companies.find(cmp => cmp.uniqueName === uniqueName);
        })).takeUntil(this.destroyed$);
        this.isUpdateCompanyProfileInProcess$ = this.store.select(state => state.session.isUpdateCompanyProfileInProcess).takeUntil(this.destroyed$);
        this.isUpdateCompanyProfileSuccess$ = this.store.select(state => state.session.isUpdateCompanyProfileSuccess).takeUntil(this.destroyed$);
        this.currenciesStream$ = this.store.select(state => state.general.currencies).takeUntil(this.destroyed$);
    }
    ngOnInit(): void {
        this.companyProfileForm = this._fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            contactNo: ['', Validators.required],
            panNumber: ['', Validators.required],
            country: ['', Validators.required],
            state: ['', Validators.required],
            city: ['', Validators.required],
            pincode: ['', Validators.required],
            address: [''],
            baseCurrency: [''],
            isMultipleCurrency: [false]
        });

        this.selectedCompany$.subscribe(s => {
            if (s) {
                let objToFill = _.cloneDeep(s);

                this.companyProfileForm.patchValue(objToFill);
            }
        });

        this.isUpdateCompanyProfileInProcess$.subscribe(ss => {
            if (ss) {
                this._loaderService.show('Updating Profile..');
            } else {
                this._loaderService.hide();
            }
        });

        this.isUpdateCompanyProfileSuccess$.subscribe(ss => {
            if (ss) {
                this.store.dispatch(this._settingsProfileActions.ResetUpdateProfileFlag());
                this.routerExtensions.router.navigate(['/settings']);
            }
        });

    }

    public submit() {
        let dataToSave = _.cloneDeep(this.companyProfileForm.value);
        if (dataToSave.email) {
            dataToSave.email = dataToSave.email.toLowerCase();
        }

        this.store.dispatch(this._settingsProfileActions.UpdateProfile(dataToSave));
    }

    public toggleDrawer() {
        this.myDrawer.toggle();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
