// angular
import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from "nativescript-angular/router";
// app
import { AppRoutes } from './app.routes';

@NgModule({
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(<any>AppRoutes),
    ],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

