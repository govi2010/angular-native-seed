import { Component, OnInit, OnDestroy } from '@angular/core';
import { topmost } from 'ui/frame';
import { Page, Color } from 'ui/page';
import { isIOS } from 'platform';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { LoginActions } from '../../../actions/login/login.action';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VerifyEmailModel, VerifyEmailResponseModel, VerifyMobileModel } from '../../../models/api-models/loginModels';
import { RouterExtensions } from 'nativescript-angular/router';
import { AnimationCurve } from 'ui/enums';

@Component({
  selector: 'ns-login-two-way',
  moduleId: module.id,
  templateUrl: './login-two-way.component.html',
  styleUrls: ['./login-two-way.component.css']
})
export class LoginTwoWayComponent implements OnInit, OnDestroy {
  public isTwoWayAuthSuccess$: Observable<boolean>;
  public isTwoWayAuthInProcess$: Observable<boolean>;
  public userDetails$: Observable<VerifyEmailResponseModel>;
  public twoWayOthForm: FormGroup;
  constructor(private _fb: FormBuilder, private store: Store<AppState>, private _loginActions: LoginActions, private routerExtensions: RouterExtensions, private page: Page) {
    this.isTwoWayAuthSuccess$ = this.store.select(s => s.login.isTwoWayAuthSuccess);
    this.userDetails$ = this.store.select(p => p.session.user);
    this.isTwoWayAuthInProcess$ = this.store.select(p => p.login.isTwoWayAuthInProcess);
  }

  public ngOnInit(): void {

    this.twoWayOthForm = this._fb.group({
      otp: ['', Validators.required]
    });

    this.page.backgroundColor = new Color(1, 0, 169, 157);
    this.page.backgroundSpanUnderStatusBar = true;
    this.page.actionBarHidden = true;

    this.isTwoWayAuthSuccess$.subscribe(s => {
      if (s) {
        this.routerExtensions.navigate(['/home'], { clearHistory: true });
      }
    })
  }
  public ngOnDestroy(): void {
    // this.lo
  }

  public verifyTwoWayCode() {
    let user: VerifyEmailResponseModel;
    this.userDetails$.take(1).subscribe(p => user = p);
    let data = new VerifyMobileModel();
    data.countryCode = Number(user.countryCode);
    data.mobileNumber = user.contactNumber;
    data.oneTimePassword = this.twoWayOthForm.value.otp;
    // this.store.dispatch(this._loginActions.VerifyTwoWayAuthRequest(data));
  }
  public backToLogin() {
    this.routerExtensions.navigate(['/login'], {
      clearHistory: true, animated: true,
      transition: {
        name: 'slideRight',
        curve: AnimationCurve.ease
      }
    });
  }
}
