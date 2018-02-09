// vendor dependencies
import { TranslateModule } from '@ngx-translate/core';
// app
import { SharedModule } from '../shared';
import { RouterModule } from '../common';
import { LoginRoutes } from './login.routes';

export const SHARED_MODULES: any[] = [
    SharedModule,
    RouterModule.forChild(<any>LoginRoutes),
    TranslateModule.forChild(),
];
