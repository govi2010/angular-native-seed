import { Component, OnInit, OnDestroy } from '@angular/core';
import { topmost } from 'ui/frame';
import { Page, Color } from 'ui/page';
import { isIOS } from 'platform';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { LoginActions } from '../../../actions/login/login.action';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterExtensions } from 'nativescript-angular/router';
import { AnimationCurve } from 'ui/enums';

@Component({
  selector: 'ns-signup',
  moduleId: module.id,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  public signUpProcess$: Observable<boolean>;
  public signupSuccess$: Observable<boolean>;
  public signupWithPasswordForm: FormGroup;
  constructor(private _fb: FormBuilder, private store: Store<AppState>, private _loginActions: LoginActions, private routerExtensions: RouterExtensions, private page: Page) {
    this.signUpProcess$ = this.store.select(s => s.login.isSignupInProcess);
    this.signupSuccess$ = this.store.select(s => s.login.isSignUpSuccess);
  }

  public ngOnInit(): void {

    this.signupWithPasswordForm = this._fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      mobileNo: ['', [Validators.required]],
    });

    this.page.backgroundColor = new Color(1, 0, 169, 157);
    this.page.backgroundSpanUnderStatusBar = true;
    this.page.actionBarHidden = true;

    this.signupSuccess$.subscribe(s => {
      if (s) {
        this.routerExtensions.navigate(['/home'], { clearHistory: true });
      }
    })
  }
  public ngOnDestroy(): void {
    // this.lo
  }
  public backToLogin() {
    this.routerExtensions.navigate(['/login'], {
      clearHistory: true, animated: true,
      transition: {
        name: 'slideBottom',
        curve: AnimationCurve.ease
      }
    });
    // this.routerExtensions.backToPreviousPage();
  }
  public signUp() {
    this.store.dispatch(this._loginActions.signUp(this.signupWithPasswordForm.value));
  }
}
