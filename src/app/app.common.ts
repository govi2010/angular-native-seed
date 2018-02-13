import { AppRoutingModule } from './app-routing.module';
// demo
import { HomeModule } from './home/home.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared';

export const SHARED_MODULES: any[] = [
    AppRoutingModule,
    HomeModule,
    DashboardModule,
    SharedModule
];

export * from './app-routing.module';
