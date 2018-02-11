import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { LoginActions } from '../../../actions/login/login.action';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VerifyEmailModel } from '../../../models/api-models/loginModels';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { NavigationStart } from '@angular/router';
import { RouterService } from '../../../services/router.service';
import { Page, AnimationCurve, Color } from '../../../common/utils/environment';
import { Config } from '../../../common';

@Component({
    selector: 'ns-login-with-email',
    moduleId: module.id,
    templateUrl: './login-with-email.component.html',
    styleUrls: ['./login-with-email.component.css']
})
export class LoginWithEmailComponent implements OnInit, OnDestroy {
    public isLoginWithEmailInProcess$: Observable<boolean>;
    public isVerifyEmailInProcess$: Observable<boolean>;
    public isVerifyEmailSuccess$: Observable<boolean>;
    public isLoginWithEmailSubmited$: Observable<boolean>;
    public emailVerifyForm: FormGroup;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private _fb: FormBuilder, private store: Store<AppState>, private _loginActions: LoginActions, private routerExtensions: RouterService, private page: Page) {
        this.isLoginWithEmailInProcess$ = this.store.select(s => s.login.isLoginWithEmailInProcess).takeUntil(this.destroyed$);
        this.isVerifyEmailInProcess$ = this.store.select(s => s.login.isVerifyEmailInProcess).takeUntil(this.destroyed$);
        this.isVerifyEmailSuccess$ = this.store.select(s => s.login.isVerifyEmailSuccess).takeUntil(this.destroyed$);
        this.isLoginWithEmailSubmited$ = this.store.select(s => s.login.isLoginWithEmailSubmited).takeUntil(this.destroyed$);

        // applicationOn(resumeEvent, (args: ApplicationEventData) => {
        //   if (args.android) {
        //     // this.store.dispatch(this._loginActions.resetLoginWithEmailFlags());
        //   } else if (args.ios) {
        //     // this.store.dispatch(this._loginActions.resetLoginWithEmailFlags());
        //   }
        // });

        if (Config.IS_MOBILE_NATIVE) {
            (this.routerExtensions.router as any).router.events.takeUntil(this.destroyed$).subscribe(ev => {
                if (ev instanceof NavigationStart) {
                    console.log(JSON.stringify(ev));
                    this.ngOnDestroy();
                }
            });
        }

        // this.page.on(Page.unloadedEvent, ev => this.ngOnDestroy());
    }

    public ngOnInit(): void {
        console.log('login with email init');
        this.store.dispatch(this._loginActions.resetLoginWithEmailFlags());
        this.emailVerifyForm = this._fb.group({
            email: ['', [Validators.required, Validators.email]],
            token: ['', Validators.required]
        });

        if (Config.IS_MOBILE_NATIVE) {
            this.page.backgroundColor = new Color(1, 0, 169, 157);
            this.page.backgroundSpanUnderStatusBar = true;
            this.page.actionBarHidden = true;
        }

        this.isVerifyEmailSuccess$.subscribe(s => {
            if (s) {
                (this.routerExtensions.router as any).navigate(['/home'], { clearHistory: true });
            }
        })
    }
    public ngOnDestroy(): void {
        console.log('login with email destroyed');
        this.store.dispatch(this._loginActions.resetLoginWithEmailFlags());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public loginWithEmail() {
        let emailForm = this.emailVerifyForm;
        this.store.dispatch(this._loginActions.signupWithEmailRequest(emailForm.value.email.toLowerCase()));
    }

    public verifyEmail() {
        let emailForm = this.emailVerifyForm;
        let data = new VerifyEmailModel();
        data.email = emailForm.value.email.toLowerCase();
        data.verificationCode = emailForm.value.token;
        this.store.dispatch(this._loginActions.verifyEmailRequest(data));
    }

    public backToLogin() {
        (this.routerExtensions.router as any).navigate(['/login'], {
            clearHistory: true, animated: true,
            transition: {
                name: 'slideRight',
                curve: AnimationCurve.ease
            }
        });
    }
}
