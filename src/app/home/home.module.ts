import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// app
import { HomeComponent } from './home.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { HomeRoutes } from './home.routes';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(<any>HomeRoutes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [HomeComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class HomeModule { }
