import { AppRoutingModule } from './app-routing.module';
// demo
import { HomeModule } from './home/home.module';
import { DashboardModule } from './dashboard/dashboard.module';

export const SHARED_MODULES: any[] = [
    AppRoutingModule,
    HomeModule,
    DashboardModule
];

export * from './app-routing.module';
