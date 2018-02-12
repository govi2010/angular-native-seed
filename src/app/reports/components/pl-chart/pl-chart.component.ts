import { ChangeDetectorRef, Component, OnDestroy, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ChartFilterType, ChartType, IProfitLossChartResponse, IReportChartData } from '../../../models/interfaces/dashboard.interface';
import { DashboardActions } from '../../../actions/dashboard/dashboard.action';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { GroupHistoryResponse, CategoryHistoryResponse } from '../../../models/api-models/Dashboard';
import { zip } from 'rxjs/observable/zip';

import { EventData } from 'tns-core-modules/data/observable';
import { LoadEventData, WebView } from "tns-core-modules/ui/web-view";

let webViewInterfaceModule = require('nativescript-webview-interface');
import { Page } from '../../../common/utils/environment';
import { ReportsActions } from '../../../actions/reports/reports.actions';

@Component({
    selector: 'ns-pl-chart,[ns-pl-chart]',
    moduleId: module.id,
    templateUrl: `./pl-chart.component.html`,
    styleUrls: ["./pl-chart.component.scss"]
})
export class PlChartComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild("myWebView") webViewRef: ElementRef;
    public currentData$: Observable<IReportChartData>;
    public previousData$: Observable<IReportChartData>;
    public profitLossChartFilter$: Observable<ChartFilterType>;
    public categories: string[] = [];
    public series: Array<{ name: string, data: number[], stack: string }>;
    public previousSeries: Array<{ name: string, data: number[], stack: string }>;
    public secondWebViewSRC = "~/new-reports/profitLossChart.html"
    private oLangWebViewInterface;


    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _reportsActions: ReportsActions, private page: Page, private _reportActions: ReportsActions, private cd: ChangeDetectorRef) {
        this.currentData$ = this.store.select(st => st.report.currentData).takeUntil(this.destroyed$);
        this.previousData$ = this.store.select(st => st.report.previousData).takeUntil(this.destroyed$);
        (this.page as any).on((Page as any).unloadedEvent, ev => this.ngOnDestroy());
    }

    ngOnInit() {
    }
    public ngAfterViewInit() {
        this.setupWebViewInterface();
        this.store.dispatch(this._reportsActions.getIncomeData());
        this.store.dispatch(this._reportsActions.getExpensesData());
    }
    public resetSeriesData() {
        this.categories = [];
        this.series = [];
        this.previousSeries = [];
    }
    public genSeries(incomeData: CategoryHistoryResponse, expensesData: GroupHistoryResponse, legendData: string[]) {
        let incomeSeries = [];
        let indirectexpensesSeries = [];
        let operatingcostSeries = [];

        if (incomeData && incomeData.intervalBalances) {
            incomeData.intervalBalances.forEach(int => {
                incomeSeries.push(int.closingBalance.amount);
            });
        }

        if (expensesData && expensesData.groups) {
            expensesData.groups.forEach(exp => {
                if (exp.uniqueName === 'indirectexpenses') {
                    exp.intervalBalances.forEach(fa => indirectexpensesSeries.push(fa.closingBalance.amount));
                } else {
                    exp.intervalBalances.forEach(fa => operatingcostSeries.push(fa.closingBalance.amount));
                }
            });
        }

        this.series = [{ name: 'income', data: incomeSeries, stack: 'income' }, { name: 'indirectexpenses', data: indirectexpensesSeries, stack: 'expenses' },
        { name: 'operatingcost', data: operatingcostSeries, stack: 'expenses' }];
        this.categories = legendData;

        // this.oLangWebViewInterface.emit('seriesUpdated', { series: this.series, categories: this.categories });
    }

    public genPreviousSeries(incomeData: CategoryHistoryResponse, expensesData: GroupHistoryResponse, legendData: string[]) {
        let incomeSeries = [];
        let indirectexpensesSeries = [];
        let operatingcostSeries = [];

        if (incomeData && incomeData.intervalBalances) {
            incomeData.intervalBalances.forEach(int => {
                incomeSeries.push(int.closingBalance.amount);
            });
        }

        if (expensesData && expensesData.groups) {
            expensesData.groups.forEach(exp => {
                if (exp.uniqueName === 'indirectexpenses') {
                    exp.intervalBalances.forEach(fa => indirectexpensesSeries.push(fa.closingBalance.amount));
                } else {
                    exp.intervalBalances.forEach(fa => operatingcostSeries.push(fa.closingBalance.amount));
                }
            });
        }

        this.previousSeries = [{ name: 'income', data: incomeSeries, stack: 'income' }, { name: 'indirectexpenses', data: indirectexpensesSeries, stack: 'expenses' },
        { name: 'operatingcost', data: operatingcostSeries, stack: 'expenses' }];
        this.categories = legendData;
        this.oLangWebViewInterface.emit('seriesUpdated', { series: this.previousSeries, categories: this.categories });
    }
    private setupWebViewInterface() {
        let webView: WebView = this.webViewRef.nativeElement;

        this.oLangWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView, this.secondWebViewSRC);

        // loading languages in dropdown, on load of webView.
        webView.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
            if (!args.error) {
                zip(this.currentData$, this.previousData$).subscribe(chartData => {
                    let incomeData = null;
                    let expensesData = null;
                    let previousIncomeData = null;
                    let previousExpensesData = null;
                    let legendData = chartData[0].legend;

                    if (chartData[0] && chartData[1]) {
                        this.resetSeriesData();
                        incomeData = chartData[0].incomeData;
                        expensesData = chartData[0].expensesData;

                        previousIncomeData = chartData[1].incomeData;
                        previousExpensesData = chartData[1].expensesData;

                    }
                    this.genSeries(incomeData, expensesData, legendData);
                    this.genPreviousSeries(previousIncomeData, previousExpensesData, legendData);
                });
            }
        });

        // this.listenLangWebViewEvents();
    }
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
