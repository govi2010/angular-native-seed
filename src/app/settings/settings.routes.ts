import { Routes } from "@angular/router";
import { SettingsComponent } from "../settings/settings.component";
import { CompanyProfileComponent } from "../settings/components/company-profile/company-profile.component";
import { CurrenciesComponent } from "../settings/components/currencies/currencies.component";
import { CreateCurrenciesComponent } from "../settings/components/create-currencies/create-currencies.component";
import { TaxesComponent } from "../settings/components/taxes/taxes.component";
import { CreateTaxesComponent } from "../settings/components/create-taxes/create-taxes.component";


export const SettingsRoutes: Routes = [
    {
        path: '',
        component: SettingsComponent
    },
    {
        path: 'company-profile',
        component: CompanyProfileComponent
    },
    {
        path: 'currencies',
        component: CurrenciesComponent
    },
    {
        path: 'create-currencies',
        component: CreateCurrenciesComponent
    },
    {
        path: 'taxes',
        component: TaxesComponent
    },
    {
        path: 'create-taxes',
        component: CreateTaxesComponent
    },
    {
        path: 'create-taxes/:uniqueName',
        pathMatch: 'full',
        component: CreateTaxesComponent
    }
];
