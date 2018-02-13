import { Component, OnInit, OnDestroy, AfterViewInit, Inject, Optional } from '@angular/core';
import { SignupWithMobile, VerifyMobileModel } from '../../../models/api-models/loginModels';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { LoginActions } from '../../../actions/login/login.action';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { NavigationStart } from '@angular/router';
import { RouterService } from '../../../services/router.service';
import { Page, Color, AnimationCurve } from '../../../common/utils/environment';
import { Config } from '../../../common';
// import { Color } from 'tns-core-modules/ui/page/page';
@Component({
    selector: 'ns-login-with-otp',
    moduleId: module.id,
    templateUrl: './login-with-otp.component.html',
    styleUrls: ['./login-with-otp.component.scss']
})
export class LoginWithOtpComponent implements OnInit, OnDestroy, AfterViewInit {
    public mobileVerifyForm: FormGroup;
    public isLoginWithMobileSubmited$: Observable<boolean>;
    public isVerifyMobileSuccess$: Observable<boolean>;
    public isLoginWithMobileInProcess$: Observable<boolean>;
    public isVerifyMobileInProcess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private routerExtensions: RouterService,@Optional() private page: Page, private store: Store<AppState>,
        private _fb: FormBuilder, private _loginActions: LoginActions) {
        this.isLoginWithMobileSubmited$ = this.store.select(s => s.login.isLoginWithMobileSubmited);
        this.isVerifyMobileSuccess$ = this.store.select(s => s.login.isVerifyMobileSuccess);
        this.isLoginWithMobileInProcess$ = this.store.select(s => s.login.isLoginWithMobileInProcess);
        this.isVerifyMobileInProcess$ = this.store.select(s => s.login.isVerifyMobileInProcess);

        if (Config.IS_MOBILE_NATIVE) {
            (this.routerExtensions.router as any).router.events.takeUntil(this.destroyed$).subscribe(ev => {
                if (ev instanceof NavigationStart) {
                    this.ngOnDestroy();
                }
            });
        }

        // this.page.on(Page.unloadedEvent, ev => this.ngOnDestroy());
    }

    ngOnInit(): void {
        this.mobileVerifyForm = this._fb.group({
            country: ['91', [Validators.required]],
            mobileNumber: ['', [Validators.required]],
            otp: ['', [Validators.required]],
        });
    }
    ngAfterViewInit() {
        // this.items = this.itemService.getItems();
        if (Config.IS_MOBILE_NATIVE) {
            this.page.backgroundColor = new Color(1, 0, 169, 157);
            this.page.backgroundSpanUnderStatusBar = true;
            this.page.actionBarHidden = true;
        }

        this.isVerifyMobileSuccess$.subscribe(s => {
            if (s) {
                if (Config.IS_MOBILE_NATIVE) {
                    (this.routerExtensions.router as any).navigate(['/home'], { clearHistory: true });
                } else {
                    this.routerExtensions.router.navigate(['/home']);
                }
            }
        });
    }
    ngOnDestroy(): void {
        this.store.dispatch(this._loginActions.resetLoginOtpFlags());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    backToLogin() {
        if (Config.IS_MOBILE_NATIVE) {
            (this.routerExtensions.router as any).navigate(['/login'], {
                clearHistory: true, animated: true,
                transition: {
                    name: 'slideRight',
                    curve: AnimationCurve.ease
                }
            });
        } else {
            this.routerExtensions.router.navigate(['/login']);
        }
    }

    public getOtp() {
        let mobileVerifyForm = this.mobileVerifyForm.value;
        let data: SignupWithMobile = new SignupWithMobile();
        data.mobileNumber = mobileVerifyForm.mobileNumber;
        data.countryCode = Number(mobileVerifyForm.country);
        this.store.dispatch(this._loginActions.signupWithMobileRequest(data));
    }

    public verifyCode() {
        let data = new VerifyMobileModel();
        let mobileVerifyForm = this.mobileVerifyForm.value;
        data.countryCode = Number(mobileVerifyForm.country);
        data.mobileNumber = mobileVerifyForm.mobileNumber;;
        data.oneTimePassword = mobileVerifyForm.otp;;
        this.store.dispatch(this._loginActions.verifyMobileRequest(data));
    }
}
