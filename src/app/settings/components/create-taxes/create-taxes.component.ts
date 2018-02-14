import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { IFlattenAccountsResultItem } from "../../../models/interfaces/flattenAccountsResultItem.interface";
import { TaxResponse } from "../../../models/api-models/Company";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { SettingsTaxesActions } from "../../../actions/settings/taxes/settings.taxes.action";
import { RouterService } from "../../../services/router.service";
import { GeneralActions } from "../../../actions/general/general.actions";
import { ActivatedRoute } from "../../../common";
import { LoaderService } from "../../../services/loader.service";
import { ToasterService } from "../../../services/toaster.service";
import * as moment from 'moment/moment';
import * as _ from 'lodash';
import { MyDrawerItem } from "../../../shared/my-drawer-item/my-drawer-item";
import { MyDrawerComponent } from "../../../shared/my-drawer/my-drawer.component";

@Component({
    selector: 'ns-create-taxes',
    moduleId: module.id,
    templateUrl: './create-taxes.component.html'
})
export class CreateTaxesComponent implements OnInit, AfterViewInit, OnDestroy {
    public navItemObj$: Observable<MyDrawerItem[]>;
    @ViewChild('myDrawer') public myDrawer: MyDrawerComponent;
    public taxForm: FormGroup;
    public isCreateTaxInProcess$: Observable<boolean>;
    public isCreateTaxSuccess$: Observable<boolean>;
    public isUpdateTaxInProcess$: Observable<boolean>;
    public isUpdateTaxSuccess$: Observable<boolean>;
    public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
    public selectedTaxObj: TaxResponse;
    public showLinkedAccounts: boolean = false;
    public taxTypeList = [
        { display: 'GST', value: 'GST' },
        { display: 'InputGST', value: 'InputGST' },
        { display: 'Others', value: 'others' }
    ];
    public taxDurationList = [
        { display: 'Monthly', value: 'MONTHLY' },
        { display: 'Quarterly', value: 'QUARTERLY' },
        { display: 'Half-Yearly', value: 'HALFYEARLY' },
        { display: 'Yearly', value: 'YEARLY' }
    ];

    public days: any[] = [];
    private taxList$: Observable<TaxResponse[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private store: Store<AppState>, private _fb: FormBuilder,
        private _settingsTaxesActions: SettingsTaxesActions, private routerExtensions: RouterService,
        private _generalActinos: GeneralActions, private pageRoute: ActivatedRoute, private _loaderService: LoaderService,
        private _toasterService: ToasterService) {

        this.taxForm = this._fb.group({
            name: ['', Validators.required],
            taxNumber: ['', Validators.required],
            taxType: ['', Validators.required],
            taxValue: ['', Validators.required],
            date: [moment().format('DD-MM-YYYY'), Validators.required],
            duration: ['', Validators.required],
            taxFileDate: ['', Validators.required],
            account: [],
            accounts: []
        });

        this.taxList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);
        this.isCreateTaxInProcess$ = this.store.select(s => s.company.isCreateTaxInProcess).takeUntil(this.destroyed$);
        this.isCreateTaxSuccess$ = this.store.select(s => s.company.isCreateTaxSuccess).takeUntil(this.destroyed$);
        this.isUpdateTaxInProcess$ = this.store.select(s => s.company.isUpdateTaxInProcess).takeUntil(this.destroyed$);
        this.isUpdateTaxSuccess$ = this.store.select(s => s.company.isUpdateTaxSuccess).takeUntil(this.destroyed$);
        this.flattenAccountsStream$ = this.store.select(s => s.general.flattenAccounts).takeUntil(this.destroyed$);
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
        this.selectedTaxObj = null;
        this.store.dispatch(this._generalActinos.getFlattenAccount());

        this.days = [];
        for (let i = 1; i <= 31; i++) {
            this.days.push({ display: i.toString(), value: i.toString() });
        }

        this.isCreateTaxInProcess$.subscribe(s => {
            if (s) {
                this._loaderService.show('Creating Tax');
            } else {
                this._loaderService.hide();
            }
        });

        this.isUpdateTaxInProcess$.subscribe(s => {
            if (s) {
                this._loaderService.show('Updating Tax');
            } else {
                this._loaderService.hide();
            }
        });

        this.isCreateTaxSuccess$.subscribe(s => {
            if (s) {
                this.routerExtensions.router.navigate(['/settings', 'taxes']);
                this.store.dispatch(this._settingsTaxesActions.ResetCreateTaxUi());
            }
        });
        this.isUpdateTaxSuccess$.subscribe(s => {
            if (s) {
                this.selectedTaxObj = null;
                this.routerExtensions.router.navigate(['/settings', 'taxes']);
                this.store.dispatch(this._settingsTaxesActions.ResetUpdateTaxUi());
            }
        });
    }

    public taxTypeChanged(val: string) {
        this.showLinkedAccounts = val === 'others';
    }

    public accountChanged(acc: string) {
        let account: IFlattenAccountsResultItem;
        this.flattenAccountsStream$.take(1).subscribe(result => {
            account = result.find(r => r.uniqueName === acc);
        });
        this.taxForm.get('accounts').patchValue([{
            name: account.name,
            uniqueName: account.uniqueName
        }]);
    }

    public fillTaxGroupForm(tax: TaxResponse) {
        let formObj = tax;
        formObj.taxType = formObj.taxType ? formObj.taxType : 'others';
        this.taxTypeChanged(formObj.taxType);

        if (formObj.taxDetail && formObj.taxDetail.length > 0) {
            formObj.taxValue = formObj.taxDetail[0].taxValue;
            formObj.date = formObj.taxDetail[0].date;
        }

        this.taxForm.patchValue(formObj);
    }


    public submit() {
        if (this.taxForm.invalid) {
            this._toasterService.errorToast('Please Fill All Details');
            return;
        }

        let dataToSave = this.taxForm.value;
        dataToSave.taxDetail = [{
            taxValue: dataToSave.taxValue,
            date: dataToSave.date
        }];

        if (!this.selectedTaxObj) {
            dataToSave.accounts = dataToSave.taxType === 'others' ? dataToSave.accounts : [];

            this.store.dispatch(this._settingsTaxesActions.CreateTax(dataToSave));
        } else {
            dataToSave.uniqueName = this.selectedTaxObj.uniqueName;

            this.store.dispatch(this._settingsTaxesActions.UpdateTax(dataToSave));
        }
    }

    public ngAfterViewInit(): void {
        this.pageRoute.params.takeUntil(this.destroyed$)
            .subscribe(params => {
                if ('uniqueName' in params) {
                    let selectedTaxUniqueName = params.uniqueName;

                    this.taxList$.take(1).subscribe(taxes => {
                        this.selectedTaxObj = _.cloneDeep(taxes.find(tx => tx.uniqueName === selectedTaxUniqueName));
                        this.fillTaxGroupForm(this.selectedTaxObj);
                    });
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
