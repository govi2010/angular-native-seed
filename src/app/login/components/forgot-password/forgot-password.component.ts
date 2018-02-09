import { Component, OnInit, OnDestroy } from '@angular/core';
import { Page, Color } from 'ui/page';
import { topmost } from 'ui/frame';
import { isIOS } from 'platform';
import { RouterExtensions } from 'nativescript-angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { LoginActions } from '../../../actions/login/login.action';
import { ResetPasswordV2 } from '../../../models/api-models/Login';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AnimationCurve } from 'ui/enums';
import * as dialogs from "ui/dialogs";
import { NavigationStart } from '@angular/router';

@Component({
  selector: 'ns-forgot-password',
  moduleId: module.id,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotComponent implements OnInit, OnDestroy {
  public forgotPasswordForm: FormGroup;
  public isForgotPasswordSuccess$: Observable<boolean>;
  public isResetPasswordSuccess$: Observable<boolean>;
  public isForgotPasswordInProcess$: Observable<boolean>;
  public isResetPasswordInProcess$: Observable<boolean>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  // private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private routerExtensions: RouterExtensions, private page: Page, private _fb: FormBuilder,
    private store: Store<AppState>, private _loginActions: LoginActions) {
    this.isForgotPasswordSuccess$ = this.store.select(s => s.login.isForgotPasswordSuccess).takeUntil(this.destroyed$);
    this.isResetPasswordSuccess$ = this.store.select(s => s.login.isResetPasswordSuccess).takeUntil(this.destroyed$);
    this.isForgotPasswordInProcess$ = this.store.select(s => s.login.isForgotPasswordInProcess).takeUntil(this.destroyed$);
    this.isResetPasswordInProcess$ = this.store.select(s => s.login.isResetPasswordInProcess).takeUntil(this.destroyed$);
    // this.page.on(Page.unloadedEvent, ev => this.ngOnDestroy());

    this.routerExtensions.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        this.ngOnDestroy();
      }
    });
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this._fb.group({
      uniqueKey: ['', [Validators.required, Validators.email]],
      verificationCode: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { updateOn: 'submit' });
    // this.items = this.itemService.getItems();
    this.page.backgroundColor = new Color(1, 0, 169, 157);
    this.page.backgroundSpanUnderStatusBar = true;
    this.page.actionBarHidden = true;

    this.isResetPasswordSuccess$.subscribe(s => {
      if (s) {
        this.routerExtensions.navigate(['/login']);
      }
    })
  }
  ngOnDestroy(): void {
    this.store.dispatch(this._loginActions.resetForgotPasswordFlags());
    this.store.dispatch(this._loginActions.resetResetPasswordV2Flags());
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

  forgotPassword() {
    this.store.dispatch(this._loginActions.forgotPasswordRequest(this.forgotPasswordForm.value.uniqueKey.toLowerCase()));
  }

  resetPassword() {
    let resetPasswordRequest = new ResetPasswordV2();
    let resetPasswordFormValues = this.forgotPasswordForm.value;

    resetPasswordRequest.uniqueKey = resetPasswordFormValues.uniqueKey.toLowerCase();
    resetPasswordRequest.verificationCode = resetPasswordFormValues.verificationCode;
    resetPasswordRequest.newPassword = resetPasswordFormValues.newPassword;

    // if (resetPasswordFormValues.newPassword)
    if (resetPasswordFormValues.newPassword !== resetPasswordFormValues.confirmPassword) {
      dialogs.alert('both password should match');
      return;
    } else {
      this.store.dispatch(this._loginActions.restPasswordV2Request(resetPasswordRequest));
    }

  }

}
