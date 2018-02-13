import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginActions } from '../../../actions/login/login.action';
import { RouterService } from '../../../services/router.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
    selector: 'ns-login',
    moduleId: module.id,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
    public loginProcess$: Observable<boolean>;
    public loginSuccess$: Observable<boolean>;
    public loginWithPasswordForm: FormGroup;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private _fb: FormBuilder, private store: Store<AppState>, private _loginActions: LoginActions, private routerExtensions: RouterService,
        private _toaster: ToasterService) {
        this.loginProcess$ = this.store.select(s => s.login.isLoginWithPasswordInProcess);
        this.loginSuccess$ = this.store.select(s => s.login.isLoginWithPasswordSuccess);

    }


    public ngOnInit(): void {
        this.loginWithPasswordForm = this._fb.group({
            uniqueKey: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        this.loginSuccess$.subscribe(s => {
            if (s) {
                (this.routerExtensions.router as any).navigate(['/home'], { clearHistory: true });
            }
        });
    }

    public ngAfterViewInit() {
    }

    public login() {
        let formValues = this.loginWithPasswordForm.value;
        formValues.uniqueKey = formValues.uniqueKey.toLowerCase();
        this.store.dispatch(this._loginActions.loginWithPassword(this.loginWithPasswordForm.value));
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
