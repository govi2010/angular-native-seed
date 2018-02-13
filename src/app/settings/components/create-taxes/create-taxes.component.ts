import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
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

@Component({
    selector: 'ns-create-taxes',
    moduleId: module.id,
    templateUrl: './create-taxes.component.html'
})
export class CreateTaxesComponent implements OnInit, AfterViewInit, OnDestroy {
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
    }

    public taxTypeChanged(val: string) {
        this.showLinkedAccounts = val === 'others';
    }

    public accountChanged(acc: IFlattenAccountsResultItem) {
        this.taxForm.get('accounts').patchValue([{
            name: acc.name,
            uniqueName: acc.uniqueName
        }]);
    }

    public submit() {

    }

    public ngAfterViewInit(): void {
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
