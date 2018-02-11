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
import { reducers, AppState } from './store';
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { ActionModule } from './actions/actions.module';
import { ServiceConfig } from './services/service.config';
import { storeLogger } from './store/middleware/storeLogger';
import { localStorageSync } from './store/middleware/rehydrateAppState';
import { NeedsAuthentication } from './decorators/needsAuthentication';
import * as elementRegistryModule from 'nativescript-angular/element-registry';
import { Fab } from 'nativescript-floatingactionbutton';
Config.PLATFORM_TARGET = Config.PLATFORMS.MOBILE_NATIVE;


elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);
elementRegistryModule.registerElement("Fab", () => Fab);
elementRegistryModule.registerElement("Carousel", () => require("nativescript-carousel").Carousel);
elementRegistryModule.registerElement("CarouselItem", () => require("nativescript-carousel").CarouselItem);
elementRegistryModule.registerElement("FilterSelect", () => require("nativescript-filter-select").FilterSelect);


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(<any>http, '/assets/i18n/', '.json');
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: ['session'], rehydrate: true })(reducer);
}

export function logger(reducer: ActionReducer<AppState>): any {
    // default, no options
    return storeLogger()(reducer);
}


let metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, logger];

elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);
elementRegistryModule.registerElement("Fab", () => Fab);
elementRegistryModule.registerElement("Carousel", () => require("nativescript-carousel").Carousel);
elementRegistryModule.registerElement("CarouselItem", () => require("nativescript-carousel").CarouselItem);
elementRegistryModule.registerElement("FilterSelect", () => require("nativescript-filter-select").FilterSelect);

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
    declarations: [
        AppComponent
    ],
    providers: [
        NeedsAuthentication,
        {
            provide: ServiceConfig,
            useValue: { apiUrl: 'http://api.giddh.com/', appUrl: 'http://api.giddh.com/' }
        },
    ],
    exports: [NativeScriptRouterModule],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
