import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";
import { NativeScriptUIGaugesModule } from "nativescript-pro-ui/gauges/angular";

import { MyDrawerItemComponent } from "./my-drawer-item/my-drawer-item.component";
import { MyDrawerComponent } from "./my-drawer/my-drawer.component";
import { MyButonComponent } from "./my-button/my-botton.component";
import { MyLogoutComponent } from "./logout-button/logout-botton.component";
import { PieChartComponent } from "~/shared/pie-chart/pie-chart.component";
import { DropDownModule } from "nativescript-drop-down/angular";
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';
import { MyChipsComponent } from "~/shared/my-chips/my-chips.component";
import { TNSFontIconModule } from "nativescript-ngx-fonticon";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIGaugesModule,
        DropDownModule,
        TNSCheckBoxModule,
        TNSFontIconModule.forRoot({
            'fa': './assets/font-awesome.min.css'
        })
    ],
    declarations: [
        MyDrawerComponent,
        MyDrawerItemComponent,
        MyButonComponent,
        MyLogoutComponent,
        PieChartComponent,
        MyChipsComponent
    ],
    exports: [
        MyDrawerComponent,
        MyButonComponent,
        MyLogoutComponent,
        MyChipsComponent,
        PieChartComponent,
        NativeScriptUISideDrawerModule,
        NativeScriptUIGaugesModule,
        TNSCheckBoxModule,
        DropDownModule,
        TNSFontIconModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule { }
