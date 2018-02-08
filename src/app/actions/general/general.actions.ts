import { Injectable } from "@angular/core";
import { CustomActions } from "../../store/customActions";
import { GeneralConst } from "../../actions/general/general.const";
import { contriesWithCodes } from "../../shared/static-data/countryWithCodes";
import { States } from "../../models/api-models/Company";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { Effect, Actions } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import { CompanyService } from "../../services/companyService.service";
import { FlattenAccountsResponse } from "../../models/api-models/Account";
import { AccountService } from "../../services/account.service";

@Injectable()
export class GeneralActions {

  @Effect()
  public getAllState$: Observable<CustomActions> = this.action$
    .ofType(GeneralConst.GET_ALL_STATES)
    .switchMap(() => this._companyService.getAllStates())
    .map(resp => this.setStatesData(resp));

  @Effect()
  public getFlattenAccounts$: Observable<CustomActions> = this.action$
    .ofType(GeneralConst.GET_FLATTEN_ACCOUNTS)
    .switchMap((action: CustomActions) =>
      this._accountService.GetFlattenAccounts(action.payload)
    )
    .map(response => {
      return this.getFlattenAccountResponse(response);
    });


  constructor(private action$: Actions, private _companyService: CompanyService, private _accountService: AccountService) {
    //
  }

  public setCountriesWithCodes(): CustomActions {
    return {
      type: GeneralConst.SET_COUNTRIES_WITH_CODES,
      payload: contriesWithCodes
    }
  }

  public getStatesData(): CustomActions {
    return {
      type: GeneralConst.GET_ALL_STATES,
    };
  }

  public setStatesData(value: BaseResponse<States[], string>): CustomActions {
    return {
      type: GeneralConst.GET_ALL_STATES_RESPONSE,
      payload: value
    }
  }

  public getFlattenAccount(value?: string): CustomActions {
    return {
      type: GeneralConst.GET_FLATTEN_ACCOUNTS,
      payload: value
    };
  }

  public getFlattenAccountResponse(value: BaseResponse<FlattenAccountsResponse, string>): CustomActions {
    return {
      type: GeneralConst.GET_FLATTEN_ACCOUNTS_RESPONSE,
      payload: value
    };
  }
}
