import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '../common';

// nativescript
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// app
import { COMPONENTS, LoginComponent, LoginWithOtpComponent, LoginWithEmailComponent, ForgotComponent, SignUpComponent, LoginTwoWayComponent } from './components';
import { SharedModule } from '../shared/shared.module';
import { LoginRoutes } from './login.routes';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        RouterModule.forChild(LoginRoutes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports:[RouterModule],
    declarations: [...COMPONENTS],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class LoginModule { }
