import { NeedsAuthentication } from "./decorators/needsAuthentication";

/**
 * Define app module routes here, e.g., to lazily load a module
 * (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
 */
export const AppRoutes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    {
        path: 'home',
        loadChildren: './app/home/home.module#HomeModule',
        canActivate: [NeedsAuthentication]
    },
    {
        path: 'login',
        loadChildren: './app/login/login.module#LoginModule'
    },
    {
        path: 'dashboard',
        loadChildren: './app/dashboard/dashboard.module#DashboardModule',
        canActivate: [NeedsAuthentication]
    },
    {
        path: 'settings',
        loadChildren: './app/settings/settings.module#SettingsModule',
        canActivate: [NeedsAuthentication]
    },
    {
        path: 'reports',
        loadChildren: './app/reports/reports.module#ReportsModule',
        canActivate: [NeedsAuthentication]
    },
    {
        path: 'sale',
        loadChildren: './app/salesInvoice/salesInvoice.module#SalesInvoiceModule',
        canActivate: [NeedsAuthentication]
    },
];
