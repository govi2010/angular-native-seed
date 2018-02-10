import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// vendor dependencies
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// app
import { Config } from './common/index';
import { AppComponent } from './app.component';
import { SHARED_MODULES } from './app.common';
import { ServiceModule } from './services/service.module';
import { reducers, AppState } from './store';
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { ActionModule } from './actions/actions.module';
import { ServiceConfig } from './services/service.config';
import { localStorageSync } from './store/middleware/rehydrateAppState';
import { storeLogger } from './store/middleware/storeLogger';
import { NeedsAuthentication } from './decorators/needsAuthentication';

Config.PLATFORM_TARGET = Config.PLATFORMS.WEB;

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: ['session'], rehydrate: true })(reducer);
}

export function logger(reducer: ActionReducer<AppState>): any {
    // default, no options
    return storeLogger()(reducer);
}

let metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, logger];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, { metaReducers }),
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
    providers: [
        NeedsAuthentication,
        {
            provide: ServiceConfig,
            useValue: { apiUrl: 'http://api.giddh.com/', appUrl: 'http://api.giddh.com/' }
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
