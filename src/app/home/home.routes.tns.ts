import { Routes } from '@angular/router';
// app
import { HomeComponent } from './components/home/home.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';

export const HomeRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [NeedsAuthentication]
    },
    {
        path: 'login',
        loadChildren: './app/login/login.module#LoginModule'
    }
];
