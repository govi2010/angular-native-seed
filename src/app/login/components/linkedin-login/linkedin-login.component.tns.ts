import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { LoginActions } from '../../../actions/login/login.action';
import { ResetPasswordV2 } from '../../../models/api-models/Login';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { NavigationStart } from '@angular/router';
import { WebView } from 'tns-core-modules/ui/web-view/web-view';
import * as token from './oauth';
import { Page, AnimationCurve } from '../../../common/utils/environment';
import { RouterService } from '../../../services/router.service';
import { Config } from '../../../common';
const LINKEDIN_CLIENT_ID = '75urm0g3386r26';
const LINKEDIN_SECRET_KEY = '3AJTvaKNOEG4ISJ0';
@Component({
    selector: 'ns-linkedin-login',
    moduleId: module.id,
    templateUrl: './linkedin-login.component.html',
    styleUrls: ['./linkedin-login.component.css']
})
export class LinkedInLoginComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild("myWebView") webViewRef: ElementRef;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    // private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private routerExtensions: RouterService, private page: Page, private _fb: FormBuilder,
        private store: Store<AppState>, private _loginActions: LoginActions) {
        if (Config.IS_MOBILE_NATIVE) {
            (this.routerExtensions.router as any).router.events.takeUntil(this.destroyed$).subscribe(ev => {
                if (ev instanceof NavigationStart) {
                    this.ngOnDestroy();
                }
            });
        }
    }

    ngOnInit(): void {
        //
    }
    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    ngAfterViewInit() {
        let config = {};
        let bodyParams = {};

        // linked in
        config = {
            clientId: LINKEDIN_CLIENT_ID,
            clientSecret: LINKEDIN_SECRET_KEY,
            authorizationUrl: 'https://www.linkedin.com/uas/oauth2/authorization',
            tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
            useBasicAuthorizationHeader: false,
            redirectUri: 'http://test.giddh.com/login' || 'http://localhost'
        };
        bodyParams = {
            scope: ['r_emailaddress'],
            state: 'STATE',
            type: '2.0'
        };

        let webView: WebView = this.webViewRef.nativeElement;
        const myApiOauth = token.default(config, webView, this.routerExtensions);
        let accessToken = myApiOauth.getAccessToken(bodyParams) as Promise<any>;
        accessToken.then((str) => {
            this.store.dispatch(this._loginActions.LinkedInElectronLogin(str.access_token));
        }, (err) => console.error(err));


    }
    backToLogin() {
        (this.routerExtensions.router as any).navigate(['/login'], {
            clearHistory: true, animated: true,
            transition: {
                name: 'slideRight',
                curve: AnimationCurve.ease
            }
        });
    }
}
