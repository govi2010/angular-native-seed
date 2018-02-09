import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// nativescript
// app
import { COMPONENTS, LoginComponent, LoginWithOtpComponent, LoginWithEmailComponent, ForgotComponent, SignUpComponent, LoginTwoWayComponent } from './components';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '../common';
import { LoginRoutes } from './login.routes';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(<any>LoginRoutes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [...COMPONENTS],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class LoginModule { }
