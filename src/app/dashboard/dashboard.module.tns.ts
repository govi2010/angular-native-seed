import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// nativescript
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { RouterModule } from '../common';
// app
import { NeedsAuthentication } from '../decorators/needsAuthentication';

import { SharedModule } from './../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { RevenueChartComponent } from './components/revenue/revenue.component';
import { ExpensesChartComponent } from './components/expenses/expenses.component';
import { DashboardFilterComponent } from './components/filter/dashboard-filter.component';
import { DashboardChartComponent } from './components/chart/dashboard-chart.component';
import { DashboardRoutes } from './dashboard.routes';


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild(DashboardRoutes),
    ],
    exports:[RouterModule],
    declarations: [DashboardComponent, RevenueChartComponent, ExpensesChartComponent, DashboardFilterComponent, DashboardChartComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class DashboardModule { }
