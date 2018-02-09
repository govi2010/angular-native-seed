import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { topmost, Frame } from 'ui/frame';
import { Page, Color } from 'ui/page';
import { isIOS } from 'platform';
import { RouterExtensions } from 'nativescript-angular/router';
import { SignupWithMobile, VerifyMobileModel } from '../../../models/api-models/loginModels';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { LoginActions } from '../../../actions/login/login.action';
import * as application from "application";
import * as utils from "utils/utils";
import { AnimationCurve } from 'ui/enums';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { NavigationStart } from '@angular/router';
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
  constructor(private routerExtensions: RouterExtensions, private page: Page, private store: Store<AppState>,
    private _fb: FormBuilder, private _loginActions: LoginActions) {
    this.isLoginWithMobileSubmited$ = this.store.select(s => s.login.isLoginWithMobileSubmited);
    this.isVerifyMobileSuccess$ = this.store.select(s => s.login.isVerifyMobileSuccess);
    this.isLoginWithMobileInProcess$ = this.store.select(s => s.login.isLoginWithMobileInProcess);
    this.isVerifyMobileInProcess$ = this.store.select(s => s.login.isVerifyMobileInProcess);

    this.routerExtensions.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        this.ngOnDestroy();
      }
    });

    // this.page.on(Page.unloadedEvent, ev => this.ngOnDestroy());
  }

  ngOnInit(): void {
    this.mobileVerifyForm = this._fb.group({
      country: ['91', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
      otp: ['', [Validators.required]],
    });
    this.isLoginWithMobileSubmited$.subscribe()
  }
  ngAfterViewInit() {
    // this.items = this.itemService.getItems();
    this.page.backgroundColor = new Color(1, 0, 169, 157);
    this.page.backgroundSpanUnderStatusBar = true;
    this.page.actionBarHidden = true;

    this.isVerifyMobileSuccess$.subscribe(s => {
      if (s) {
        this.routerExtensions.navigate(['/home'], { clearHistory: true });
      }
    });
  }
  ngOnDestroy(): void {
    this.store.dispatch(this._loginActions.resetLoginOtpFlags());
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  backToLogin() {
    this.routerExtensions.navigate(['/login'], {
      clearHistory: true, animated: true,
      transition: {
        name: 'slideRight',
        curve: AnimationCurve.ease
      }
    });
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
