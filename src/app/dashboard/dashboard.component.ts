import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { RouterService } from '../services/router.service';
import { MyDrawerComponent } from '../shared/my-drawer/my-drawer.component';
import { Observable } from 'rxjs/Observable';
import { MyDrawerItem } from '../shared/my-drawer-item/my-drawer-item';

@Component({
    selector: 'ns-dashboard',
    moduleId: module.id,
    templateUrl: `./dashboard.component.html`,
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild('myDrawer') public myDrawer: MyDrawerComponent;
    public navItemObj$: Observable<MyDrawerItem[]>;
    constructor(private store: Store<AppState>, private routerExtensions: RouterService) {
        this.navItemObj$ = this.store.select(p => p.general.navDrawerObj).map(p => {
            for (const iterator of p) {
                if (iterator.router) {
                    if (iterator.router === '/dashboard') {
                        iterator.isSelected = true;
                    } else {
                        iterator.isSelected = false;
                    }
                }
            }
            return p;
        });
    }

    ngOnInit() {

    }

    public toggleDrawer() {
        this.myDrawer.toggle();
    }
}
