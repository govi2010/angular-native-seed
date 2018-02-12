import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { ChartType, ChartFilterType } from '../../../models/interfaces/dashboard.interface';
import { ChartCustomFilter } from '../../../models/api-models/Dashboard';
import { DashboardActions } from '../../../actions/dashboard/dashboard.action';
import { AppState } from '../../../store';
import { RouterService } from '../../../services/router.service';
import { Config, ActivatedRoute } from '../../../common';
import { ReportsActions } from '../../../actions/reports/reports.actions';

@Component({
    selector: 'ns-dashboard-filter',
    moduleId: module.id,
    templateUrl: `./dashboard-filter.component.html`,
    styleUrls: ['./dashboard-filter.component.css']
})
export class DashboardFilterComponent implements OnInit {
    public chartType: ChartType;
    public items: Array<{ text: string, selected: boolean, val: ChartFilterType }>;
    public showCustomFilterInputs: boolean = false;
    public customFilterObj: ChartCustomFilter;

    constructor(private routerExtensions: RouterService, private store: Store<AppState>,
        private _dashboardActions: DashboardActions, private _reportsActions: ReportsActions, private activatedRouter: ActivatedRoute) {

        this.items = [
            { val: ChartFilterType.ThisMonthToDate, text: 'This Month to Date', selected: false },
            { val: ChartFilterType.ThisQuarterToDate, text: 'This Quarter to Date', selected: false },
            { val: ChartFilterType.ThisFinancialYearToDate, text: 'This Financial Year to Date', selected: false },
            { val: ChartFilterType.ThisYearToDate, text: 'This Year to Date', selected: false },
            { val: ChartFilterType.LastMonth, text: 'Last Month', selected: false },
            { val: ChartFilterType.LastQuater, text: 'Last Quater', selected: false },
            { val: ChartFilterType.LastFiancialYear, text: 'Last Fiancial Year', selected: false },
            { val: ChartFilterType.LastYear, text: 'Last Year', selected: false },
            { val: ChartFilterType.Custom, text: 'Custom', selected: false },
        ];

        this.customFilterObj = new ChartCustomFilter();
    }

    ngOnInit() {
        Config.IS_MOBILE_NATIVE && (this.activatedRouter as any).activatedRoute
            .switchMap(activatedRoute => activatedRoute.params)
            .subscribe((params) => {
                this.chartType = Number(params['chartType']) as ChartType;
            });

        if (this.chartType === ChartType.Revenue) {
            this.store.select(p => p.dashboard.revenueChartFilter).take(1).subscribe(s => {
                this.setSelectedItem(s);
            });
        } else if (this.chartType === ChartType.Expense) {
            this.store.select(p => p.dashboard.expensesChartFilter).take(1).subscribe(s => {
                this.setSelectedItem(s);
            });
        } else if (this.chartType === ChartType.ProfitLoss) {
            this.store.select(p => p.report.profitLossChartFilter).take(1).subscribe(s => {
                this.setSelectedItem(s);
            });
        }
    }

    onNavBtnTap() {
        Config.IS_MOBILE_NATIVE && (this.routerExtensions.router as any).backToPreviousPage();
    }

    changeCheckedRadio(item: { val: ChartFilterType, text: string, selected: boolean }) {
        this.showCustomFilterInputs = item.val === ChartFilterType.Custom;
        this.items.forEach(option => {
            option.selected = option.val === item.val;
        });
    }

    saveAndClose() {
        let item = this.items.find(f => f.selected);
        let url: string;
        let customFilterObj: any = this.customFilterObj;

        if (item.val === ChartFilterType.Custom) {
            customFilterObj.activeYear.startDate = moment(customFilterObj.activeYear.startDate).format('DD-MM-YYYY');
            customFilterObj.activeYear.endDate = moment(customFilterObj.activeYear.endDate).format('DD-MM-YYYY');

            customFilterObj.lastYear.startDate = moment(customFilterObj.lastYear.startDate).format('DD-MM-YYYY');
            customFilterObj.lastYear.endDate = moment(customFilterObj.lastYear.endDate).format('DD-MM-YYYY');
        } else {
            customFilterObj = null;
        }

        if (this.chartType === ChartType.ProfitLoss) {
            url = '/new-reports';
            // this.store.dispatch(this._reportsActions.setProfitLossChartFilter(item.val, customFilterObj));
        } else {
            url = '/dashboard';
            this.store.dispatch(this._dashboardActions.setChartFilter(this.chartType, item.val, customFilterObj));
        }
        this.customFilterObj = new ChartCustomFilter();
        Config.IS_MOBILE_NATIVE && (this.routerExtensions.router as any).navigateByUrl(url, { clearHistory: true });
    }

    setSelectedItem(selVal) {
        this.showCustomFilterInputs = selVal === ChartFilterType.Custom;
        this.items.forEach(p => {
            if (p.val === selVal) {
                p.selected = true;
            }
        });
    }

    public openFromDatePicker(year: string = 'activeYear') {
        let ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;
        const picker = new ModalPicker();
        picker.pickDate({
            title: "Select From Date",
            theme: "dark",
            maxDate: new Date(new Date().getFullYear(), 11, 31),
            startingDate: moment(this.customFilterObj[year].startDate, 'DD-MM-YYYY').toDate()
        }).then((result) => {
            let date = `${result.day}-${result.month}-${result.year}`
            this.customFilterObj[year].startDate = moment(date, 'DD-MM-YYYY').toDate();
        }).catch((error) => {
            console.log("Error: " + JSON.stringify(error));
        });
    }

    public openToDatePicker(year: string = 'activeYear') {
        let ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;
        const picker = new ModalPicker();
        picker.pickDate({
            title: "Select To Date",
            theme: "dark",
            maxDate: new Date(new Date().getFullYear(), 11, 31),
            startingDate: moment(this.customFilterObj[year].endDate, 'DD-MM-YYYY').toDate()
        }).then((result) => {
            let date = `${result.day}-${result.month}-${result.year}`
            this.customFilterObj[year].endDate = moment(date, 'DD-MM-YYYY').toDate();
        }).catch((error) => {
            console.log("Error: " + JSON.stringify(error));
        });
    }
}
