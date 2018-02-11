import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment/moment';
import { Store } from '@ngrx/store';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { createSelector } from 'reselect';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ChartType, IChildGroups, IExpensesChartClosingBalanceResponse, ChartFilterType } from '../../../models/interfaces/dashboard.interface';
import { AccountChartDataLastCurrentYear } from '../../../models/view-models/AccountChartDataLastCurrentYear';
import { AppState } from '../../../store';
import { DashboardActions } from '../../../actions/dashboard/dashboard.action';
import { Page } from '../../../common/utils/environment';
import { Config } from '../../../common';
import { INameUniqueName } from '../../../models/interfaces/nameUniqueName.interface';
import { RouterService } from '../../../services/router.service';

@Component({
    selector: 'ns-expenses-chart,[ns-expenses-chart]',
    moduleId: module.id,
    templateUrl: `./expenses.component.html`,
    styleUrls: ["./expenses.component.scss"]
})
export class ExpensesChartComponent implements OnInit {
    public chartType: ChartType = ChartType.Expense;
    public requestInFlight: boolean;
    public activeYearAccounts: IChildGroups[] = [];
    public lastYearAccounts: IChildGroups[] = [];
    public expensesChartData$: Observable<IExpensesChartClosingBalanceResponse>;
    public accountStrings: AccountChartDataLastCurrentYear[] = [];
    public activeYearAccountsRanks: ObservableArray<any> = new ObservableArray([]);
    public lastYearAccountsRanks: ObservableArray<any> = new ObservableArray([]);
    public activeYearGrandAmount: number = 0;
    public lastYearGrandAmount: number = 0;
    public activePieChartAmount: number = 0;
    public lastPieChartAmount: number = 0;
    public chartFilterType$: Observable<ChartFilterType>;
    public chartFilterTitle: string = 'Custom';
    public activeYearChartFormatedDate: string;
    public lastYearChartFormatedDate: string;
    public selectedSeriesLabel: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _dashboardActions: DashboardActions, private page: Page,
        private cd: ChangeDetectorRef, private routerExtensions: RouterService) {
        this.expensesChartData$ = this.store.select(p => p.dashboard.expensesChart).takeUntil(this.destroyed$);
        this.chartFilterType$ = this.store.select(p => p.dashboard.expensesChartFilter).takeUntil(this.destroyed$);
        Config.IS_MOBILE_NATIVE && (this.page as any).on((Page as any).unloadedEvent, ev => this.ngOnDestroy());
    }

    ngOnInit() {
        this.fetchChartData();
        this.expensesChartData$.subscribe(exp => {
            // if (exp) {
            if (exp && exp.operatingcostActiveyear && exp.indirectexpensesActiveyear) {
                let indirectexpensesGroups = [].concat.apply([], exp.indirectexpensesActiveyear.childGroups);
                let operatingcostGroups = [].concat.apply([], exp.operatingcostActiveyear.childGroups);
                let accounts = _.unionBy(indirectexpensesGroups as IChildGroups[], operatingcostGroups as IChildGroups[]) as IChildGroups[];
                this.activeYearAccounts = accounts;
            } else {
                this.resetActiveYearChartData();
            }

            if (exp && exp.operatingcostLastyear && exp.indirectexpensesLastyear) {
                let indirectexpensesGroups = [].concat.apply([], exp.indirectexpensesLastyear.childGroups);
                let operatingcostGroups = [].concat.apply([], exp.operatingcostLastyear.childGroups);
                let lastAccounts = _.unionBy(indirectexpensesGroups as IChildGroups[], operatingcostGroups as IChildGroups[]) as IChildGroups[];
                this.lastYearAccounts = lastAccounts;
            } else {
                this.resetLastYearChartData();
            }
            if (exp && exp.chartTitle) {
                this.chartFilterTitle = exp.chartTitle;
            }

            if (exp && exp.lable) {
                this.activeYearChartFormatedDate = exp.lable.activeYearLabel || '';
                this.lastYearChartFormatedDate = exp.lable.lastYearLabel || '';
            }
            // }
            this.generateCharts();
            this.requestInFlight = false;
            this.cd.detectChanges();

        });
    }

    public generateCharts() {
        this.accountStrings = _.uniqBy(this.generateActiveYearString().concat(this.generateLastYearString()), 'uniqueName');
        this.accountStrings.forEach((ac) => {
            ac.activeYear = 0;
            ac.lastYear = 0;
            let index = -1;
            index = _.findIndex(this.activeYearAccounts, (p) => p.uniqueName === ac.uniqueName);
            if (index !== -1) {
                ac.activeYear = this.activeYearAccounts[index].closingBalance.amount;
            }
            index = -1;
            index = _.findIndex(this.lastYearAccounts, (p) => p.uniqueName === ac.uniqueName);
            if (index !== -1) {
                ac.lastYear = this.lastYearAccounts[index].closingBalance.amount;
            }
        });

        this.accountStrings = _.filter(this.accountStrings, (a) => {
            return !(a.activeYear === 0 && a.lastYear === 0);
        });

        let activeAccounts = [];
        let lastAccounts = [];

        this.accountStrings.forEach(p => {
            activeAccounts.push({ name: p.name, amount: p.activeYear });
        });

        this.accountStrings.forEach(p => {
            lastAccounts.push({ name: p.name, amount: p.lastYear });
        });

        while (this.activeYearAccountsRanks.length) {
            this.activeYearAccountsRanks.pop();
        }

        this.activeYearAccountsRanks.push(activeAccounts);
        this.activeYearGrandAmount = _.sumBy(activeAccounts, 'amount') || 0;
        this.activePieChartAmount = this.activeYearGrandAmount >= 1 ? 100 : 0;

        while (this.lastYearAccountsRanks.length) {
            this.lastYearAccountsRanks.pop();
        }

        this.lastYearAccountsRanks.push(lastAccounts);
        this.lastYearGrandAmount = _.sumBy(lastAccounts, 'amount') || 0;
        this.lastPieChartAmount = this.lastYearGrandAmount >= 1 ? 100 : 0;

    }

    public generateActiveYearString(): INameUniqueName[] {
        let activeStrings: INameUniqueName[] = [];
        this.activeYearAccounts.map(acc => {
            activeStrings.push({ uniqueName: acc.uniqueName, name: acc.groupName });
        });
        return activeStrings;
    }

    public generateLastYearString(): INameUniqueName[] {
        let lastStrings: INameUniqueName[] = [];
        this.lastYearAccounts.map(acc => {
            lastStrings.push({ uniqueName: acc.uniqueName, name: acc.groupName });
        });
        return lastStrings;
    }


    public fetchChartData() {
        this.requestInFlight = true;
        this.store.dispatch(this._dashboardActions.getExpensesChartDataActiveYear(false));
        this.store.dispatch(this._dashboardActions.getExpensesChartDataLastYear(false));
    }

    public calculatePieChartPer(t) {
        let activeYearIndexTotal = this.activeYearAccountsRanks.getItem(t.pointIndex).amount || 0;
        let lastYearIndexTotal = this.lastYearAccountsRanks.getItem(t.pointIndex).amount || 0;

        this.selectedSeriesLabel = this.activeYearAccountsRanks.getItem(t.pointIndex).name;

        this.activePieChartAmount = Math.round((activeYearIndexTotal * 100) / this.activeYearGrandAmount) || 0;
        this.lastPieChartAmount = Math.round((lastYearIndexTotal * 100) / this.lastYearGrandAmount) || 0;
    }

    public resetActiveYearChartData() {
        this.activeYearAccounts = [];
        while (this.activeYearAccountsRanks.length) {
            this.activeYearAccountsRanks.pop();
        }
        // this.activeBarSeries.nativeElement.items.length = 0;
        // this.activeYearAccountsRanks = new ObservableArray([]);
        this.activeYearGrandAmount = 0;
        this.activePieChartAmount = 0;
    }

    public resetLastYearChartData() {
        this.lastYearAccounts = [];
        while (this.lastYearAccountsRanks.length) {
            this.lastYearAccountsRanks.pop();
        }
        // this.lastYearAccountsRanks = new ObservableArray([]);
        this.lastYearGrandAmount = 0;
        this.lastPieChartAmount = 0;
    }

    public openFilters() {
        this.routerExtensions.router.navigate(['/dashboard', 'filter', this.chartType]);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
