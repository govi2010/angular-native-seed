import { ActionReducerMap } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import * as fromLogin from './login/login.reducer';
import * as fromSession from './session/session.reducer';
import * as fromCompany from './company/company.reducer';
import * as fromGeneral from './general/general.reducer';
import * as fromDashboard from './dashboard/dashboard.reducer';
import * as fromReport from './reports/reports.reducer';

export interface AppState {
    router: fromRouter.RouterReducerState;
    login: fromLogin.LoginState;
    company: fromCompany.CurrentCompanyState;
    session: fromSession.SessionState;
    general: fromGeneral.GeneralState;
    dashboard: fromDashboard.DashboardState;
    report: fromReport.ReportsState;
}

export const reducers: ActionReducerMap<AppState> = {
    router: fromRouter.routerReducer,
    login: fromLogin.LoginReducer,
    session: fromSession.SessionReducer,
    company: fromCompany.CompanyReducer,
    general: fromGeneral.GeneralReducer,
    dashboard: fromDashboard.DashboardReducer,
    report: fromReport.ReportsReducer,
};
