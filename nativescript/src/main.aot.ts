// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScript } from "nativescript-angular/platform-static";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/combineLatest';

// import './socialLogin';
// "./app.module.ngfactory" is a dynamically generated module when compiled with AoT.
import { AppModuleNgFactory } from "./app/app.module.ngfactory";
import { enableProdMode } from "@angular/core";
enableProdMode();
platformNativeScript().bootstrapModuleFactory(AppModuleNgFactory);
