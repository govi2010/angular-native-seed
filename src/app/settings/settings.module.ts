import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { SettingsComponent } from '../settings/settings.component';
import { CompanyProfileComponent } from '../settings/components/company-profile/company-profile.component';
import { CurrenciesComponent } from '../settings/components/currencies/currencies.component';
import { CreateCurrenciesComponent } from '../settings/components/create-currencies/create-currencies.component';
import { TaxesComponent } from '../settings/components/taxes/taxes.component';
import { CreateTaxesComponent } from '../settings/components/create-taxes/create-taxes.component';
import { RouterModule } from '../common';
import { CommonModule } from '@angular/common';
import { SettingsRoutes } from './settings.routes';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(SettingsRoutes),
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [SettingsComponent, CompanyProfileComponent, CurrenciesComponent,
        CreateCurrenciesComponent, TaxesComponent, CreateTaxesComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SettingsModule { }
