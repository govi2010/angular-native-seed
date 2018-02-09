import { Injectable } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';

@Injectable()
export class RouterService {
    constructor(public router: RouterExtensions) {

    }
}
