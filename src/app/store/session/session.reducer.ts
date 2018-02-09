import {CustomActions} from '../customActions';
import {
  VerifyEmailModel,
  VerifyEmailResponseModel,
  VerifyMobileModel,
  VerifyMobileResponseModel
} from '../../models/api-models/loginModels';
import {LoginConstants} from '../../actions/login/login.const';
import {BaseResponse} from '../../models/api-models/BaseResponse';
import {LoginWithPassword} from '../../models/api-models/Login';
import {CompanyResponse, StateDetailsResponse} from '../../models/api-models/Company';
import {CompanyConstants} from '~/actions/company/company.const';
import {SettingsProfileConstants} from "~/actions/settings/profile/settings.profile.const";
import * as _ from 'lodash';

export enum userLoginStateEnum {
  notLoggedIn,
  userLoggedIn,
  needTwoWayAuth
}

export interface SessionState {
  user: VerifyEmailResponseModel,
  companyUniqueName: string;                   // current user | null
  companies: CompanyResponse[];
  lastState: string;
  userLoginState: userLoginStateEnum;
  isUpdateCompanyProfileInProcess: boolean;
  isUpdateCompanyProfileSuccess: boolean;
}

const initialState: SessionState = {
  user: null,
  companyUniqueName: '',
  companies: [],
  lastState: '',
  userLoginState: userLoginStateEnum.notLoggedIn,
  isUpdateCompanyProfileInProcess: false,
  isUpdateCompanyProfileSuccess: false
};

export function SessionReducer(state: SessionState = initialState, action: CustomActions): SessionState {
  switch (action.type) {
    case 'Error': {
      return state;
    }
    case LoginConstants.SET_INITIAL_SESSION_STATE:
      return action.payload;
    case LoginConstants.LOGIN_WITH_PASSWORD_RESPONSE: {
      let resp: BaseResponse<VerifyMobileResponseModel, LoginWithPassword> = action.payload;
      if (resp.status === 'success') {
        return Object.assign({}, state, {
          user: resp.body,
          userLoginState: userLoginStateEnum.userLoggedIn
        });
      } else {
        return Object.assign({}, state, {
          user: null,
          userLoginState: userLoginStateEnum.notLoggedIn
        });
      }
    }
    case LoginConstants.VERIFY_MOBILE_RESPONCE: {
      let resp: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (resp.status === 'success') {
        return Object.assign({}, state, {
          user: resp.body,
          userLoginState: userLoginStateEnum.userLoggedIn
        });
      } else {
        return Object.assign({}, state, {
          user: null,
          userLoginState: userLoginStateEnum.notLoggedIn
        });
      }
    }

    case LoginConstants.VERIFY_EMAIL_RESPONCE: {
      let data: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = action.payload;
      if (data.status === 'success') {
        return Object.assign({}, state, {
          user: data.body,
          userLoginState: userLoginStateEnum.userLoggedIn
        });
      } else {
        return Object.assign({}, state, {
          user: null,
          userLoginState: userLoginStateEnum.notLoggedIn
        });
      }
    }

    case LoginConstants.VERIFY_TWOWAYAUTH_RESPONSE: {
      let data1: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (data1.status === 'success') {
        return Object.assign({}, state, {
          user: data1.body
        });
      }
      return state;
    }

    case LoginConstants.SIGNUP_WITH_GOOGLE_RESPONSE: {
      let data: BaseResponse<VerifyEmailResponseModel, string> = action.payload;
      if (data.status === 'success') {
        return Object.assign({}, state, {
          user: data.body,
          userLoginState: userLoginStateEnum.userLoggedIn
        });
      } else {
        return Object.assign({}, state, {
          user: null,
          userLoginState: userLoginStateEnum.notLoggedIn
        });
      }
    }

    case CompanyConstants.REFRESH_COMPANIES_RESPONSE: {
      let companies: BaseResponse<CompanyResponse[], string> = action.payload;
      if (companies.status === 'success') {
        return Object.assign({}, state, {
          companies: companies.body
        });
      }
      return state;
    }

    //region Update Company Profile
    case SettingsProfileConstants.UPDATE_PROFILE: {
      return Object.assign({}, state, {
        isUpdateCompanyProfileInProcess: true
      });

    }
    case SettingsProfileConstants.UPDATE_PROFILE_RESPONSE: {
      let company: BaseResponse<CompanyResponse, any> = action.payload;
      if (company.status === 'success') {
        let allCompanies = _.cloneDeep(state.companies);
        allCompanies = allCompanies.map(ac => {
          if (ac.uniqueName === company.body.uniqueName) {
            return company.body;
          }
          return ac;
        });
        return Object.assign({}, state, {
          companies: allCompanies,
          isUpdateCompanyProfileInProcess: false,
          isUpdateCompanyProfileSuccess: true
        });
      }
      return Object.assign({}, state, {
        isUpdateCompanyProfileInProcess: false,
        isUpdateCompanyProfileSuccess: false
      });
    }

    case SettingsProfileConstants.RESET_UPDATE_PROFILE_UI_FLAGS: {
      return Object.assign({}, state, {
        isUpdateCompanyProfileInProcess: false,
        isUpdateCompanyProfileSuccess: false
      });
    }
    //endregion

    case CompanyConstants.CHANGE_COMPANY_RESPONSE: {
      let stateData: BaseResponse<StateDetailsResponse, string> = action.payload;
      if (stateData.status === 'success') {
        return Object.assign({}, state, {
          companyUniqueName: stateData.body.companyUniqueName,
          lastState: stateData.body.lastState
        });
      }
      return state;
    }

    case LoginConstants.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
