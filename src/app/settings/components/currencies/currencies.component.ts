import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RouterService } from '../../../services/router.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';

@Component({
    selector: 'ns-currencies',
    moduleId: module.id,
    templateUrl: './currencies.component.html'
})

export class CurrenciesComponent implements OnInit, OnDestroy {
    public currenciesStream$: Observable<string[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private store: Store<AppState>, private routerExtensions: RouterService) {
        this.currenciesStream$ = this.store.select(state => state.general.currencies).takeUntil(this.destroyed$);
    }

    public ngOnInit() {
        //
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
