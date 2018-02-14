import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RouterService } from '../../../services/router.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { MyDrawerItem } from '../../../shared/my-drawer-item/my-drawer-item';
import { MyDrawerComponent } from '../../../shared/my-drawer/my-drawer.component';

@Component({
    selector: 'ns-currencies',
    moduleId: module.id,
    templateUrl: './currencies.component.html'
})

export class CurrenciesComponent implements OnInit, OnDestroy {
    public navItemObj$: Observable<MyDrawerItem[]>;
    @ViewChild('myDrawer') public myDrawer: MyDrawerComponent;
    public currenciesStream$: Observable<string[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private store: Store<AppState>, private routerExtensions: RouterService) {
        this.currenciesStream$ = this.store.select(state => state.general.currencies).takeUntil(this.destroyed$);
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

    public ngOnInit() {
        //
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    public toggleDrawer() {
        this.myDrawer.toggle();
    }
}
