import { Component, OnDestroy, OnInit } from '@angular/core';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import {
    ChartFilterType,
    ChartType,
    IChildGroups,
    IRevenueChartClosingBalanceResponse
} from '../../../models/interfaces/dashboard.interface';
import { AccountChartDataLastCurrentYear } from '../../../models/view-models/AccountChartDataLastCurrentYear';
import { INameUniqueName } from '../../../models/interfaces/nameUniqueName.interface';
import { DashboardActions } from '../../../actions/dashboard/dashboard.action';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppState } from '../../../store';
import { Page } from '../../../common/utils/environment';
import { Config } from '../../../common';

@Component({
    selector: 'ns-revenue-chart,[ns-revenue-chart]',
    moduleId: module.id,
    templateUrl: `./revenue.component.html`,
    styleUrls: ["./revenue.component.scss"]
})
export class RevenueChartComponent implements OnInit, OnDestroy {
    public chartType: ChartType = ChartType.Revenue;
    public requestInFlight: boolean;
    public activeYearAccounts: IChildGroups[] = [];
    public lastYearAccounts: IChildGroups[] = [];
    public revenueChartData$: Observable<IRevenueChartClosingBalanceResponse>;
    public accountStrings: AccountChartDataLastCurrentYear[] = [];
    public activeYearAccountsRanks: ObservableArray<any> = new ObservableArray([]);
    public lastYearAccountsRanks: ObservableArray<any> = new ObservableArray([]);
    public activeYearGrandAmount: number = 0;
    public lastYearGrandAmount: number = 0;
    public activePieChartAmount: number = 0;
    public lastPieChartAmount: number = 0;
    public selectedSeriesLabel: string = '';
    public chartFilterType$: Observable<ChartFilterType>;
    public chartFilterTitle: string = 'Custom';
    public activeYearChartFormatedDate: string;
    public lastYearChartFormatedDate: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private store: Store<AppState>, private _dashboardActions: DashboardActions, private page: Page) {
        this.revenueChartData$ = this.store.select(p => p.dashboard.revenueChart).takeUntil(this.destroyed$);

        this.chartFilterType$ = this.store.select(p => p.dashboard.revenueChartFilter).takeUntil(this.destroyed$);
        if (Config.IS_MOBILE_NATIVE) {
            (this.page as any).on((Page as any).unloadedEvent, ev => this.ngOnDestroy());
        }
    }

    ngOnInit() {
        this.fetchChartData();
        this.revenueChartData$.subscribe(rvn => {
            // if (rvn) {
            if (rvn && rvn.revenuefromoperationsActiveyear && rvn.otherincomeActiveyear) {
                let revenuefromoperationsAccounts = [].concat.apply([], rvn.revenuefromoperationsActiveyear.childGroups);
                let otherincomeAccounts = [].concat.apply([], rvn.otherincomeActiveyear.childGroups);
                let groups = _.unionBy(revenuefromoperationsAccounts as IChildGroups[], otherincomeAccounts as IChildGroups[]) as IChildGroups[];
                this.activeYearAccounts = groups;
            } else {
                this.resetActiveYearChartData();
            }

            if (rvn && rvn.revenuefromoperationsLastyear && rvn.otherincomeLastyear) {
                let revenuefromoperationsAccounts = [].concat.apply([], rvn.revenuefromoperationsLastyear.childGroups);
                let otherincomeAccounts = [].concat.apply([], rvn.otherincomeLastyear.childGroups);
                let lastAccounts = _.unionBy(revenuefromoperationsAccounts as IChildGroups[], otherincomeAccounts as IChildGroups[]) as IChildGroups[];
                this.lastYearAccounts = lastAccounts;
            } else {
                this.resetLastYearChartData();
            }

            if (rvn && rvn.chartTitle) {
                this.chartFilterTitle = rvn.chartTitle;
            }

            if (rvn && rvn.lable) {
                this.activeYearChartFormatedDate = rvn.lable.activeYearLabel || '';
                this.lastYearChartFormatedDate = rvn.lable.lastYearLabel || '';
            }

            this.generateCharts();
            // }
            this.requestInFlight = false;
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
        this.store.dispatch(this._dashboardActions.getRevenueChartDataActiveYear(false));
        this.store.dispatch(this._dashboardActions.getRevenueChartDataLastYear(false));
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


    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
