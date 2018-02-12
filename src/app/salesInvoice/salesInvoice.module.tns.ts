import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// nativescript
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIChartModule } from "nativescript-pro-ui/chart/angular";

// app
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { SharedModule } from './../shared/shared.module';
import { SalesInvoiceComponent } from '../salesInvoice/salesInvoice.component';
import { SaleListComponent } from '../salesInvoice/component/saleList/saleList.component';
import { SaleAddComponent } from '../salesInvoice/component/saleAdd/saleAdd.component';
import { StockAddComponent } from '../salesInvoice/component/stockAdd/stockAdd.component';
import { TaxRateComponent } from '../salesInvoice/component/taxRate/taxRate.component';
import { CreateStockComponent } from '../salesInvoice/component/createStock/createStock.component';
import { CreateStockAddProductComponent } from '../salesInvoice/component/createStockAddProduct/createStockAddProduct.component';
import { CreateStockAddServiceComponent } from '../salesInvoice/component/createStockAddService/createStockAddService.component';
import { CreateGroupComponent } from '../salesInvoice/component/createGroup/createGroup.component';
import { CreateGroupAddProductComponent } from '../salesInvoice/component/createGroupAddProduct/createGroupAddProduct.component';
import { CreateGroupAddServiceComponent } from '../salesInvoice/component/createGroupAddService/createGroupAddService.component';
import { CreateAccountComponent } from '../salesInvoice/component/createAccount/createAccount.component';
import { RouterModule } from '../common';
import { SalesInvoiceRoutes } from './salesInvoice.routes';



@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild(SalesInvoiceRoutes),
        NativeScriptUIChartModule
    ],
    declarations: [SalesInvoiceComponent, SaleListComponent, SaleAddComponent, StockAddComponent,
        TaxRateComponent, CreateStockComponent, CreateStockAddProductComponent, CreateStockAddServiceComponent,
        CreateGroupComponent, CreateGroupAddProductComponent, CreateGroupAddServiceComponent, CreateAccountComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SalesInvoiceModule { }
