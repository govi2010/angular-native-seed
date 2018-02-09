import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// nativescript
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
// vendor dependencies
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// app
import { Config } from './common/index';
import { AppComponent } from './app.component';
import { SHARED_MODULES } from './app.common';
import { AppRoutes } from './app.routes';
import { ServiceModule } from './services/service.module';
import { reducers } from './store';
import { StoreModule } from '@ngrx/store';
import { ActionModule } from './actions/actions.module';
import { ServiceConfig } from './services/service.config';
Config.PLATFORM_TARGET = Config.PLATFORMS.MOBILE_NATIVE;

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(<any>http, '/assets/i18n/', '.json');
}

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpClientModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(AppRoutes, { enableTracing: false }),
        StoreModule.forRoot(reducers, {}),
        ServiceModule.forRoot(),
        ActionModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        ...SHARED_MODULES
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        {
            provide: ServiceConfig,
            useValue: { apiUrl: 'http://api.giddh.com/', appUrl: 'http://api.giddh.com/' }
        },
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
