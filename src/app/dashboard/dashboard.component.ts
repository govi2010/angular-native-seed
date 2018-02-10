import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { RouterService } from '../services/router.service';

@Component({
    selector: 'ns-dashboard',
    moduleId: module.id,
    templateUrl: `./dashboard.component.html`,
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    constructor(private store: Store<AppState>, private routerExtensions: RouterService) {
    }

    ngOnInit() {

    }
}
