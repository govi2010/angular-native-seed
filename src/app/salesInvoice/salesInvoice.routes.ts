
import { Routes } from "@angular/router";
import { SalesInvoiceComponent } from "../salesInvoice/salesInvoice.component";
import { SaleListComponent } from "../salesInvoice/component/saleList/saleList.component";
import { SaleAddComponent } from "../salesInvoice/component/saleAdd/saleAdd.component";
import { StockAddComponent } from "../salesInvoice/component/stockAdd/stockAdd.component";
import { CreateStockComponent } from "../salesInvoice/component/createStock/createStock.component";
import { CreateGroupComponent } from "../salesInvoice/component/createGroup/createGroup.component";
import { CreateAccountComponent } from "../salesInvoice/component/createAccount/createAccount.component";


export const SalesInvoiceRoutes: Routes = [
    {
        path: '',
        component: SalesInvoiceComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'list' },
            { path: 'list', pathMatch: 'full', component: SaleListComponent },
            { path: 'add', pathMatch: 'full', component: SaleAddComponent },
            { path: 'add-stock', pathMatch: 'full', component: StockAddComponent },
            { path: 'create-group', pathMatch: 'full', component: CreateGroupComponent },
            { path: 'create-stock', pathMatch: 'full', component: CreateStockComponent },
            { path: 'create-account', pathMatch: 'full', component: CreateAccountComponent }
        ]
    },
];
