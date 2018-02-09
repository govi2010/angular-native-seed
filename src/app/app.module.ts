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
import { reducers } from './store';
import { StoreModule } from '@ngrx/store';
import { ActionModule } from './actions/actions.module';
import { ServiceConfig } from './services/service.config';

Config.PLATFORM_TARGET = Config.PLATFORMS.WEB;

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
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
    providers: [
        {
            provide: ServiceConfig,
            useValue: { apiUrl: 'http://api.giddh.com/', appUrl: 'http://api.giddh.com/' }
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
