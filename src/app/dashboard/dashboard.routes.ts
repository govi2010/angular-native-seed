import { DashboardComponent } from "./dashboard.component";
import { DashboardChartComponent } from "./components/chart/dashboard-chart.component";
import { DashboardFilterComponent } from "./components/filter/dashboard-filter.component";



export const DashboardRoutes = [
    {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full',
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
];
