import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";


export const HomeRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    }, {
        path: 'login',
        loadChildren: './app/login/login.module#LoginModule'
    }

];
