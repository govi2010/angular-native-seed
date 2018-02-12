import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { SharedModule } from '../shared/shared.module';
import { ReportsComponent } from '../reports/reports.component';
import { PlChartComponent } from '../reports/components/pl-chart/pl-chart.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '../common';
import { ReportsRoutes } from './reports.routes';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(ReportsRoutes),
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations: [ReportsComponent, PlChartComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class NewReportsModule {
}
