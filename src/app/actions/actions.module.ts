import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { LoginActions } from './login/login.action';
import { CompanyActions } from './company/company.action';
import { DashboardActions } from './dashboard/dashboard.action';
import { GeneralActions } from './general/general.actions';
import { SettingsTaxesActions } from './settings/taxes/settings.taxes.action';
import { SettingsProfileActions } from "./settings/profile/settings.profile.action";
import { ReportsAction } from "./reports/reports.action";

@NgModule({
    imports: [
        EffectsModule.forRoot([
            LoginActions,
            CompanyActions,
            DashboardActions,
            GeneralActions,
            SettingsTaxesActions,
            SettingsProfileActions,
            ReportsAction
        ])
    ],
    exports: [EffectsModule]
})
export class ActionModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: ActionModule,
            providers: []
        };
    }
}
