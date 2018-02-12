import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { SelectedIndexChangedEventData, ValueList } from "nativescript-drop-down";
import { IContriesWithCodes } from '../../../shared/static-data/countryWithCodes';
import { ReplaySubject } from 'rxjs//ReplaySubject';
import { NsDropDownOptions } from '../../../models/other-models/HelperModels';
import { CompanyResponse } from '../../../models/api-models/Company';
import { createSelector } from 'reselect';
import { AppState } from '../../../store';
import { GroupService } from '../../../services/group.service';
import { RouterService } from '../../../services/router.service';
import { Page } from '../../../common/utils/environment';
import { Config } from '../../../common';
import { GroupResponse } from '../../../models/api-models/Group';

@Component({
    selector: 'ns-create-account',
    templateUrl: `./createAccount.component.html`,
    moduleId: module.id
})
export class CreateAccountComponent implements OnInit, OnDestroy {
    public addAccountForm: FormGroup;
    public flatAccountWGroupsList: ValueList<string>;
    public countrySource: ValueList<string>;
    public selectedCompany$: Observable<CompanyResponse>;
    public countrySourceStream$: Observable<IContriesWithCodes[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupService: GroupService,
        private page: Page, public _routerExtension: RouterService) {
        this.countrySourceStream$ = this.store.select(s => s.general.contriesWithCodes);

        this.selectedCompany$ = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
            if (!companies) {
                return;
            }

            return companies.find(cmp => {
                return cmp.uniqueName === uniqueName;
            });
        })).takeUntil(this.destroyed$);

        Config.IS_MOBILE_NATIVE && ((this.page as any).on((Page as any).unloadedEvent, ev => this.ngOnDestroy()));
    }

    public ngOnInit() {
        this.initializeNewForm();

        // get groups list and refine list
        this.groupService.GetGroupSubgroups('currentassets').subscribe(res => {
            let result: NsDropDownOptions[] = [];
            if (res.status === 'success' && res.body.length > 0) {
                let sundryGrp = _.find(res.body, { uniqueName: 'sundrydebtors' });
                if (sundryGrp) {
                    let flatGrps = this.groupService.flattenGroup([sundryGrp], []);
                    _.forEach(flatGrps, (grp: GroupResponse) => {
                        result.push({ display: grp.name, value: grp.uniqueName });
                    });
                }
            }
            this.flatAccountWGroupsList = new ValueList(result);
        });

        this.countrySourceStream$.subscribe(countries => {
            let cntArray: NsDropDownOptions[] = [];
            if (countries) {
                countries.forEach(cnt => {
                    cntArray.push({ display: `${cnt.countryflag} - ${cnt.countryName}`, value: cnt.countryflag });
                });
            }
            this.countrySource = new ValueList(cntArray);
        });

        this.selectedCompany$.subscribe(s => {
            if (s) {
                this.setCountryByCompany(s);
            }
        })

    }

    public initializeNewForm() {
        this.addAccountForm = this._fb.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            uniqueName: ['', [Validators.required]],
            parentGroupUniqueName: ['', [Validators.required]],
            openingBalanceType: ['CREDIT'],
            openingBalance: [0],
            mobileNo: [''],
            email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
            attentionTo: [''],
            description: [''],
            country: this._fb.group({
                countryCode: ['']
            }),
            currency: [''],
        });
    }

    public setCountryByCompany(company: CompanyResponse) {
        let countryIndex = this.countrySource.getIndex(company.country);
        let result: string = this.countrySource.getValue(countryIndex);
        if (result) {
            this.addAccountForm.get('country').get('countryCode').patchValue(result);
        } else {
            this.addAccountForm.get('country').get('countryCode').patchValue('IN');
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
