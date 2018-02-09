import { Injectable } from "@angular/core";
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from "rxjs/Observable";

import { BaseResponse } from "../../models/api-models/BaseResponse";
import { CustomActions } from "../../store/customActions";
import { CompanyConstants } from "./company.const";
import { AuthenticationService } from "../../services/authentication.service";
import { SignUpWithPassword, LoginWithPassword, ResetPasswordV2 } from "../../models/api-models/Login";
import { VerifyMobileResponseModel, SignupWithMobile, VerifyMobileModel, VerifyEmailModel, VerifyEmailResponseModel } from "../../models/api-models/loginModels";

import { CompanyService } from "../../services/companyService.service";
import { CompanyResponse, StateDetailsResponse, TaxResponse } from "../../models/api-models/Company";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { GeneralService } from "../../services/general.service";
// import * as Toast from 'nativescript-toast';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import { ToasterService } from "../../services/toaster.service";
@Injectable()

export class CompanyActions {

    @Effect()
    public refreshCompanies$: Observable<CustomActions> = this.actions$
        .ofType(CompanyConstants.REFRESH_COMPANIES)
        .switchMap((action: CustomActions) => this._companyService.CompanyList())
        .map(response => {
            let res: BaseResponse<CompanyResponse[], string> = response;
            if (response.status === 'error') {
                this._toaster.errorToast(res.message);
                return { type: 'Error', payload: res }
            } else {

                // check if user have companies
                if (response.body.length) {
                    let activeCompanyName = null;
                    this.store.select(s => s.session.companyUniqueName).take(1).subscribe(a => activeCompanyName = a);
                    if (activeCompanyName) {
                        let companyIndex = response.body.findIndex(cmp => cmp.uniqueName === activeCompanyName);
                        if (companyIndex > -1) {
                            // if active company find no action needed
                        } else {
                            // if no active company active next company from companies list
                            this.store.dispatch(this.changeCompany(response.body[0].uniqueName));
                        }
                    } else {
                        // if no active company active next company from companies list
                        this.store.dispatch(this.changeCompany(response.body[0].uniqueName));
                    }
                } else {
                    //  if no companies available open create new company popup
                    // return {
                    //   type: 'SetLoginStatus',
                    //   payload: 2
                    // } as CustomActions;
                }
                return this.refreshCompaniesResponse(response);
            }
        });

    @Effect()
    public changeCompany$: Observable<CustomActions> = this.actions$
        .ofType(CompanyConstants.CHANGE_COMPANY)
        .switchMap((action: CustomActions) => this._companyService.getStateDetails(action.payload))
        .map(response => {
            if (response.status === 'error') {
                //
                let dummyResponse = new BaseResponse<StateDetailsResponse, string>();
                dummyResponse.body = new StateDetailsResponse();
                dummyResponse.body.companyUniqueName = response.request;
                dummyResponse.body.lastState = 'home';
                dummyResponse.status = 'success';
                return this.changeCompanyResponse(dummyResponse);
            }
            this._generalServices.companyUniqueName = response.request;
            this._toaster.successToast('Company Switched Successfully');

            return this.changeCompanyResponse(response);
        });

    @Effect()
    public CompanyTax$: Observable<CustomActions> = this.actions$
        .ofType(CompanyConstants.GET_COMPANY_TAX)
        .switchMap((action: CustomActions) => this._companyService.getComapnyTaxes())
        .map(response => {
            if (response.status === 'error') {
                console.log(JSON.stringify(response.message));
            }
            return {
                type: CompanyConstants.GET_COMPANY_TAX_RESPONSE,
                payload: response
            }
        });
    constructor(private actions$: Actions, private _authService: AuthenticationService, private _companyService: CompanyService,
        private store: Store<AppState>, private _generalServices: GeneralService, private _toaster: ToasterService) {

    }

    public refreshCompanies(): CustomActions {
        return {
            type: CompanyConstants.REFRESH_COMPANIES
        };
    }

    public refreshCompaniesResponse(response: BaseResponse<CompanyResponse[], string>): CustomActions {
        return {
            type: CompanyConstants.REFRESH_COMPANIES_RESPONSE,
            payload: response
        };
    }

    public changeCompany(cmpUniqueName: string): CustomActions {
        return {
            type: CompanyConstants.CHANGE_COMPANY,
            payload: cmpUniqueName
        };
    }

    public changeCompanyResponse(value: BaseResponse<StateDetailsResponse, string>): CustomActions {
        return {
            type: CompanyConstants.CHANGE_COMPANY_RESPONSE,
            payload: value
        };
    }

    public getTax(): CustomActions {
        return {
            type: CompanyConstants.GET_COMPANY_TAX
        };
    }

    // private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
    //   if (response.status === 'error') {
    //     if (showToast) {
    //       this._toasty.errorToast(response.message);
    //     }
    //     return errorAction;
    //   } else {
    //     if (showToast && typeof response.body === 'string') {
    //       // this._toasty.successToast(response.body);
    //     }
    //   }
    //   return successAction;
    // }
}
