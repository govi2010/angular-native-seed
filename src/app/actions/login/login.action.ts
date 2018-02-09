import { Injectable } from "@angular/core";
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from "rxjs/Observable";

import { BaseResponse } from "../../models/api-models/BaseResponse";
import { CustomActions } from "../../store/customActions";
import { LoginConstants } from "./login.const";
import { AuthenticationService } from "../../services/authentication.service";
import { SignUpWithPassword, LoginWithPassword, ResetPasswordV2 } from "../../models/api-models/Login";
import { VerifyMobileResponseModel, SignupWithMobile, VerifyMobileModel, VerifyEmailModel, VerifyEmailResponseModel } from "../../models/api-models/loginModels";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Configuration } from "../../app.constants";
import { ToasterService } from "../../services/toaster.service";

@Injectable()

export class LoginActions {

    @Effect()
    public signUp$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.SIGNUP_REQUEST)
        .switchMap((action: CustomActions) =>
            this._authService.SignupWithPassword(action.payload))
        .map(response => {
            let res: BaseResponse<VerifyMobileResponseModel, SignUpWithPassword> = response;
            if (res.status !== 'success') {
                this._toaster.errorToast(res.message);
            } else {
                this._toaster.successToast('Login Success');
            }
            return this.signUpResponse(res);
        });

    @Effect()
    public loginWithPassword$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.LOGIN_WITH_PASSWORD_REQUEST)
        .switchMap((action: CustomActions) =>
            this._authService.LoginWithPassword(action.payload))
        .map(response => {
            let res: BaseResponse<VerifyMobileResponseModel, LoginWithPassword> = response;
            if (res.status !== 'success') {
                this._toaster.errorToast(res.message);
            } else {
                this._toaster.successToast('Login Success');
            }
            return this.loginWithPasswordResponse(res);
        });

    @Effect()
    public signupWithMobile$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.SIGNUP_WITH_MOBILE_REQUEST)
        .switchMap((action: CustomActions) => this._authService.SignupWithMobile(action.payload))
        .map(response => {
            if (response.status !== 'success') {
                this._toaster.errorToast(response.message);
            }
            return this.signupWithMobileResponce(response);
        });

    @Effect()
    public verifyMobile$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.VERIFY_MOBILE_REQUEST)
        .switchMap((action: CustomActions) =>
            this._authService.VerifyOTP(action.payload as VerifyMobileModel)
        )
        .map(response => {
            let res: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = response;
            if (res.status !== 'success') {
                this._toaster.errorToast(res.message);
            }
            return this.verifyMobileResponce(res);
        });


    @Effect()
    public signupWithEmail$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.SIGNUP_WITH_EMAIL_REQUEST)
        .switchMap((action: CustomActions) => this._authService.SignupWithEmail(action.payload))
        .map(response => {
            if (response.status !== 'success') {
                this._toaster.errorToast(response.message);
            }

            return this.signupWithEmailResponce(response);

        });

    @Effect()
    public verifyEmail$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.VERIFY_EMAIL_REQUEST)
        .switchMap((action: CustomActions) =>
            this._authService.VerifyEmail(action.payload as VerifyEmailModel)
        )
        .map(response => {
            let res: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = response;
            if (response.status !== 'success') {
                this._toaster.errorToast(response.message);
            }
            return this.verifyEmailResponce(res);
        });

    @Effect()
    public verifyTwoWayAuth$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.VERIFY_TWOWAYAUTH_REQUEST)
        .switchMap((action: CustomActions) =>
            this._authService.VerifyOTP(action.payload as VerifyMobileModel)
        )
        .map(response => {
            let res: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = response;
            if (response.status !== 'success') {
                this._toaster.errorToast(response.message);
            }
            return this.verifyTwoWayAuthResponse(res);
        });

    @Effect()
    public signupWithGoogle$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.SIGNUP_WITH_GOOGLE_RESPONSE)
        .map((action: CustomActions) => {
            let res: BaseResponse<VerifyEmailResponseModel, string> = action.payload;
            if (res.status !== 'success') {
                this._toaster.errorToast(res.message);
            }
            return {
                type: 'EmptyAction'
            }
        });

    @Effect()
    public forgotPassword$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.FORGOT_PASSWORD_REQUEST)
        .switchMap((action: CustomActions) =>
            this._authService.ForgotPassword(action.payload))
        .map(response => {
            let res: BaseResponse<string, string> = response;
            if (res.status !== 'success') {
                this._toaster.errorToast(res.message);
                // return { type: '' }
            }
            return this.forgotPasswordResponse(res);

        });

    @Effect()
    public resetPasswordV2$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.RESET_PASSWORD_V2_REQUEST)
        .switchMap((action: CustomActions) =>
            this._authService.ResetPasswordV2(action.payload))
        .map(response => {
            let res: BaseResponse<string, ResetPasswordV2> = response;
            if (res.status !== 'success') {
                this._toaster.errorToast(res.message);
                // return { type: '' }
            }
            return this.resetPasswordV2Response(res);

        });

    @Effect()
    public LinkedInElectronLogin$: Observable<CustomActions> = this.actions$
        .ofType(LoginConstants.LinkedInLoginElectron)
        .switchMap((action: CustomActions) => {

            let args: any = { headers: {} };
            args.headers['cache-control'] = 'no-cache';
            args.headers['Content-Type'] = 'application/json';
            args.headers['Accept'] = 'application/json';
            args.headers['Access-Token'] = action.payload;
            args.headers = new HttpHeaders(args.headers);
            return this.http.get(Configuration.ApiUrl + 'v2/login-with-linkedIn', {
                headers: args.headers,
                responseType: 'json'
            }).map(p => p as BaseResponse<VerifyEmailResponseModel, string>);
        })
        .map((data) => {
            console.log(JSON.stringify(data));
            if (data.status === 'error') {
                return { type: 'EmptyAction' };
            }
            // return this.LoginSuccess();
            return this.signupWithGoogleResponse(data);
        });

    constructor(private actions$: Actions, private _authService: AuthenticationService, public http: HttpClient,
    private _toaster: ToasterService) {

    }

    public signUp(value: SignUpWithPassword): CustomActions {
        return {
            type: LoginConstants.SIGNUP_REQUEST,
            payload: value
        }
    }

    public signUpResponse(response: BaseResponse<VerifyMobileResponseModel, SignUpWithPassword>): CustomActions {
        return {
            type: LoginConstants.SIGNUP_RESPONSE,
            payload: response
        }
    }

    public loginWithPassword(value: LoginWithPassword): CustomActions {
        return {
            type: LoginConstants.LOGIN_WITH_PASSWORD_REQUEST,
            payload: value
        }
    }

    public loginWithPasswordResponse(response: BaseResponse<VerifyMobileResponseModel, LoginWithPassword>): CustomActions {
        return {
            type: LoginConstants.LOGIN_WITH_PASSWORD_RESPONSE,
            payload: response
        }
    }

    public signupWithMobileRequest(value: SignupWithMobile): CustomActions {
        return {
            type: LoginConstants.SIGNUP_WITH_MOBILE_REQUEST,
            payload: value
        };
    }

    public signupWithMobileResponce(value: BaseResponse<string, SignupWithMobile>): CustomActions {
        return {
            type: LoginConstants.SIGNUP_WITH_MOBILE_RESPONCE,
            payload: value
        };
    }

    public resetLoginOtpFlags(): CustomActions {
        return {
            type: LoginConstants.RESET_LOGIN_OTP_FLAGS
        }
    }

    public verifyMobileRequest(value: VerifyMobileModel): CustomActions {
        return {
            type: LoginConstants.VERIFY_MOBILE_REQUEST,
            payload: value
        };
    }

    public verifyMobileResponce(value: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>): CustomActions {
        return {
            type: LoginConstants.VERIFY_MOBILE_RESPONCE,
            payload: value
        };
    }


    public signupWithEmailRequest(value: string): CustomActions {
        return {
            type: LoginConstants.SIGNUP_WITH_EMAIL_REQUEST,
            payload: value
        };
    }

    public signupWithEmailResponce(value: BaseResponse<string, string>): CustomActions {
        return {
            type: LoginConstants.SIGNUP_WITH_EMAIL_RESPONCE,
            payload: value
        };
    }

    public signupWithGoogleResponse(value: BaseResponse<VerifyEmailResponseModel, string>): CustomActions {
        return {
            type: LoginConstants.SIGNUP_WITH_GOOGLE_RESPONSE,
            payload: value
        };
    }


    public verifyEmailRequest(value: VerifyEmailModel): CustomActions {
        return {
            type: LoginConstants.VERIFY_EMAIL_REQUEST,
            payload: value
        };
    }

    public verifyEmailResponce(value: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>): CustomActions {
        return {
            type: LoginConstants.VERIFY_EMAIL_RESPONCE,
            payload: value
        };
    }

    public resetLoginWithEmailFlags(): CustomActions {
        return {
            type: LoginConstants.RESET_LOGIN_WITH_EMAIL_FLAGS
        }
    }

    public verifyTwoWayAuthRequest(value: VerifyMobileModel): CustomActions {
        return {
            type: LoginConstants.VERIFY_TWOWAYAUTH_REQUEST,
            payload: value
        };
    }

    public verifyTwoWayAuthResponse(value: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>): CustomActions {
        return {
            type: LoginConstants.VERIFY_TWOWAYAUTH_RESPONSE,
            payload: value
        };
    }

    public setInitialSessionState(value: any): CustomActions {
        return {
            type: LoginConstants.SET_INITIAL_SESSION_STATE,
            payload: value
        }
    }

    public forgotPasswordRequest(email: string): CustomActions {
        return {
            type: LoginConstants.FORGOT_PASSWORD_REQUEST,
            payload: email
        }
    }

    public forgotPasswordResponse(res): CustomActions {
        return {
            type: LoginConstants.FORGOT_PASSWORD_RESPONSE,
            payload: res
        }
    }

    public resetForgotPasswordFlags(): CustomActions {
        return {
            type: LoginConstants.RESET_FORGOT_PASSWORD_FLAGS
        }
    }

    public restPasswordV2Request(requestModel: ResetPasswordV2): CustomActions {
        return {
            type: LoginConstants.RESET_PASSWORD_V2_REQUEST,
            payload: requestModel
        }
    }

    public resetPasswordV2Response(res: BaseResponse<string, ResetPasswordV2>): CustomActions {
        return {
            type: LoginConstants.RESET_PASSWORD_V2_RESPONSE,
            payload: res
        }
    }

    public resetResetPasswordV2Flags(): CustomActions {
        return {
            type: LoginConstants.RESET_RESET_PASSWORD_FLAGS
        }
    }

    public logout(): CustomActions {
        return {
            type: LoginConstants.LOGOUT
        }
    }
    public LinkedInElectronLogin(value: any): CustomActions {
        return {
            type: LoginConstants.LinkedInLoginElectron,
            payload: value
        };
    }
    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this._toaster.errorToast(response.message);
            }
            return errorAction;
        } else {
            if (showToast && typeof response.body === 'string') {
                this._toaster.successToast(response.body);
            }
        }
        return successAction;
    }
}
