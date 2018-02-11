import { DashboardComponent } from "./dashboard.component";
import { DashboardChartComponent } from "./components/chart/dashboard-chart.component";
import { DashboardFilterComponent } from "./components/filter/dashboard-filter.component";
import { Routes } from "@angular/router";



export const DashboardRoutes: Routes = [
    {
        path: '',
<<<<<<< HEAD
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
=======
        redirectTo: 'charts',
        pathMatch: 'full'
>>>>>>> dbee36f119ff5dc6464ed294ef61e879876f15fb
    },
    {
        path: 'charts',
        component: DashboardChartComponent
    },
    {
        path: 'filter/:chartType',
        component: DashboardFilterComponent
    }
];
