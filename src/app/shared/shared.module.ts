import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { MyDrawerItemComponent } from "./my-drawer-item/my-drawer-item.component";
import { MyDrawerComponent } from "./my-drawer/my-drawer.component";
import { MyButonComponent } from "./my-button/my-botton.component";
import { MyLogoutComponent } from "./logout-button/logout-botton.component";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { MyChipsComponent } from "./my-chips/my-chips.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    MatButtonModule, MatCardModule, MatListModule, MatGridListModule, MatChipsModule, MatDatepickerModule,
    MatFormFieldModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatInputModule, MatCheckboxModule, MatSelectModule
} from '@angular/material';
import { MyHeaderComponent } from "./my-header/my-header.component";
import { LaddaModule } from 'angular2-ladda';

const matModules = [MatButtonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ...matModules
    ],
    declarations: [
        MyDrawerComponent,
        MyDrawerItemComponent,
        MyButonComponent,
        MyLogoutComponent,
        PieChartComponent,
        MyChipsComponent,
        MyHeaderComponent
    ],
    exports: [
        MyDrawerComponent,
        MyButonComponent,
        MyLogoutComponent,
        MyChipsComponent,
        PieChartComponent,
        MyHeaderComponent,
        LaddaModule,
        ...matModules
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule { }
