import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment/moment';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { createSelector } from 'reselect';
import { DrawerTransitionBase } from 'nativescript-pro-ui/sidedrawer';
import { RadSideDrawerComponent } from 'nativescript-pro-ui/sidedrawer/angular';
import { MyDrawerItem } from '../../../shared/my-drawer-item/my-drawer-item';
import { RouterService } from '../../../services/router.service';

@Component({
    selector: 'ns-sale-list',
    moduleId: module.id,
    templateUrl: `./saleList.component.html`
})
export class SaleListComponent implements OnInit {
    public navItemObj$: Observable<MyDrawerItem[]>;
    @ViewChild("drawer") public drawerComponent: RadSideDrawerComponent;
    private _sideDrawerTransition: DrawerTransitionBase;
    constructor(private store: Store<AppState>, private routerExtensions: RouterService) {
        this.navItemObj$ = this.store.select(p => p.general.navDrawerObj).map(p => {
            for (const iterator of p) {
                if (iterator.router) {
                    if (iterator.router === '/sale') {
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
        //
    }
    public get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }
    public onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }
}
