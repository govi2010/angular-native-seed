import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { NeedsAuthentication } from "../decorators/needsAuthentication";


export const HomeRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [NeedsAuthentication]
    }, {
        path: 'login',
        loadChildren: './app/login/login.module#LoginModule'
    }

];
