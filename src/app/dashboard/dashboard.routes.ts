import { DashboardComponent } from "./dashboard.component";
import { DashboardChartComponent } from "./components/chart/dashboard-chart.component";
import { DashboardFilterComponent } from "./components/filter/dashboard-filter.component";
import { Routes } from "@angular/router";



export const DashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: '',
                redirectTo: 'charts',
                pathMatch: 'full',
            },
            {
                path: 'charts',
                component: DashboardChartComponent
            },
            {
                path: 'filter/:chartType',
                component: DashboardFilterComponent
            }
        ]

    },
    // {
    //     path: 'charts',
    //     component: DashboardChartComponent
    // },
    // {
    //     path: 'filter/:chartType',
    //     component: DashboardFilterComponent
    // }
];
