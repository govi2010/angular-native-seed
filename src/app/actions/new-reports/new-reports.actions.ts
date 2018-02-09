import { Actions, Effect } from "@ngrx/effects";
import { DashboardService } from "~/services/dashboard.service";
import { CustomActions } from "~/store/customActions";
import { NewReportConst } from "~/actions/new-reports/new-reports.const";
import { ChartFilterType, IGroupHistoryGroups } from "~/models/interfaces/dashboard.interface";
import { ChartCustomFilter, ChartFilterConfigs, GroupHistoryRequest, CategoryHistoryResponse, GroupHistoryResponse } from "~/models/api-models/Dashboard";
import { createSelector, Store } from "@ngrx/store";
import { AppState } from "~/store/roots";
import { ActiveFinancialYear } from "~/models/api-models/Company";

import * as _ from 'lodash';
import * as moment from 'moment/moment';
import { zip } from "rxjs/observable/zip";
import { of } from "rxjs/observable/of";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
@Injectable()
export class NewReportsActions {

  @Effect()
  public getIncomeData$: Observable<CustomActions> = this.actions$
    .ofType(NewReportConst.PROFIT_LOSS_CHART.GET_INCOME_DATA_REQUEST)
    .switchMap((action: CustomActions) => {
      let filterType: ChartFilterType;
      let activeFinancialYear: ActiveFinancialYear;
      let lastFinancialYear: ActiveFinancialYear;
      // let customFilterObj: ChartCustomFilter;
      // this.store.select(p => p.newReport.).take(1).subscribe(p => customFilterObj = p);
      this.store.select(s => s.newReport.profitLossChartFilter).take(1).subscribe(p => filterType = p);
      this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
        return { companies, uniqueName };
      })).take(1).subscribe(res => {
        if (!res.companies) {
          return;
        }
        let financialYears = [];
        let activeCmp = res.companies.find(p => p.uniqueName === res.uniqueName);
        if (activeCmp) {
          activeFinancialYear = activeCmp.activeFinancialYear;

          if (activeCmp.financialYears.length > 1) {
            financialYears = activeCmp.financialYears.filter(cm => cm.uniqueName !== activeFinancialYear.uniqueName);
            financialYears = _.filter(financialYears, (it: ActiveFinancialYear) => {
              let a = moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY');
              let b = moment(it.financialYearEnds, 'DD-MM-YYYY');

              return b.diff(a, 'days') < 0;
            });
            financialYears = _.orderBy(financialYears, (p: ActiveFinancialYear) => {
              let a = moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY');
              let b = moment(p.financialYearEnds, 'DD-MM-YYYY');
              return b.diff(a, 'days');
            }, 'desc');
            lastFinancialYear = financialYears[0];
          }
        }
      });
      let op = parseDates(filterType, activeFinancialYear, lastFinancialYear, null);
      let model: GroupHistoryRequest = {
        category: ['income']
      };
      return zip(
        this._dashboardService.GetCategoryHistory(model, op.lastYear.startDate, op.activeYear.endDate, 'monthly'),
        of(op)
      );
    }).map((res) => {
      if (res[0].status === 'success') {
        let obj: CategoryHistoryResponse = res[0].body[0];
        let config: ChartFilterConfigs = res[1];
        return {
          type: NewReportConst.PROFIT_LOSS_CHART.GET_INCOME_DATA_RESPONSE,
          payload: { data: obj, config }
        };
      }
      else {
        return {
          type: NewReportConst.PROFIT_LOSS_CHART.GET_INCOME_DATA_ERROR,
        };
      }
    });

  @Effect()
  public getExpensesData$: Observable<CustomActions> = this.actions$
    .ofType(NewReportConst.PROFIT_LOSS_CHART.GET_EXPENSES_DATA_REQUEST)
    .switchMap((action: CustomActions) => {
      let filterType: ChartFilterType;
      let activeFinancialYear: ActiveFinancialYear;
      let lastFinancialYear: ActiveFinancialYear;
      // let customFilterObj: ChartCustomFilter;
      // this.store.select(p => p.newReport.).take(1).subscribe(p => customFilterObj = p);
      this.store.select(s => s.newReport.profitLossChartFilter).take(1).subscribe(p => filterType = p);
      this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
        return { companies, uniqueName };
      })).take(1).subscribe(res => {
        if (!res.companies) {
          return;
        }
        let financialYears = [];
        let activeCmp = res.companies.find(p => p.uniqueName === res.uniqueName);
        if (activeCmp) {
          activeFinancialYear = activeCmp.activeFinancialYear;

          if (activeCmp.financialYears.length > 1) {
            financialYears = activeCmp.financialYears.filter(cm => cm.uniqueName !== activeFinancialYear.uniqueName);
            financialYears = _.filter(financialYears, (it: ActiveFinancialYear) => {
              let a = moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY');
              let b = moment(it.financialYearEnds, 'DD-MM-YYYY');

              return b.diff(a, 'days') < 0;
            });
            financialYears = _.orderBy(financialYears, (p: ActiveFinancialYear) => {
              let a = moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY');
              let b = moment(p.financialYearEnds, 'DD-MM-YYYY');
              return b.diff(a, 'days');
            }, 'desc');
            lastFinancialYear = financialYears[0];
          }
        }
      });
      let op = parseDates(filterType, activeFinancialYear, lastFinancialYear, null);
      let model: GroupHistoryRequest = {
        groups: ['indirectexpenses', 'operatingcost']
      };
      return zip(
        this._dashboardService.GetHistory(model, op.lastYear.startDate, op.activeYear.endDate, 'monthly'),
        of(op)
      );
    }).map((res) => {
      if (res[0].status === 'success') {
        let obj: GroupHistoryResponse = res[0].body;
        let config: ChartFilterConfigs = res[1];
        return {
          type: NewReportConst.PROFIT_LOSS_CHART.GET_EXPENSES_DATA_RESPONSE,
          payload: { data: obj, config }
        };
      }
      else {
        // let obj: GroupHistoryResponse = {
        //   groups: [
        //     { name: 'Indirect Expenses', uniqueName: 'indirectexpenses', intervalBalances: [] } as IGroupHistoryGroups,
        //     { name: 'Operating Cost', uniqueName: 'operatingcost', intervalBalances: [] } as IGroupHistoryGroups
        //   ]
        // };
        return {
          type: NewReportConst.PROFIT_LOSS_CHART.GET_EXPENSES_DATA_ERROR,
        };
      }
    });

  constructor(private actions$: Actions, private _dashboardService: DashboardService, private store: Store<AppState>) {

  }

  public getIncomeData(): CustomActions {
    return {
      type: NewReportConst.PROFIT_LOSS_CHART.GET_INCOME_DATA_REQUEST
    }
  }

  public getExpensesData(): CustomActions {
    return {
      type: NewReportConst.PROFIT_LOSS_CHART.GET_EXPENSES_DATA_REQUEST
    }
  }

  public setFilterType(filterType: ChartFilterType, customFilterObj: ChartCustomFilter): CustomActions {
    return {
      type: NewReportConst.SET_REPORT_FILTER_TYPE,
      payload: { filterType, customFilterObj }
    }
  }
}


const parseDates = (filterType: ChartFilterType, activeFinancialYear: ActiveFinancialYear, lastFinancialYear: ActiveFinancialYear, customFilterObj: ChartCustomFilter): ChartFilterConfigs => {
  let config = new ChartFilterConfigs();
  switch (filterType) {
    case ChartFilterType.ThisMonthToDate: // This Month to Date
      config.ChartTitle = 'This Month to Date';
      config.activeYear.startDate = moment().startOf('month').format('DD-MM-YYYY');
      config.activeYear.endDate = moment().format('DD-MM-YYYY');
      config.activeYear.lable = moment().format('MMMM')

      config.lastYear.startDate = moment(config.activeYear.startDate, 'DD-MM-YYYY').subtract(1, 'month').format('DD-MM-YYYY');
      config.lastYear.endDate = moment(config.activeYear.endDate, 'DD-MM-YYYY').endOf('month').subtract(1, 'month').format('DD-MM-YYYY');
      config.lastYear.lable = moment(config.activeYear.startDate, 'DD-MM-YYYY').subtract(1, 'month').format('MMMM');

      config.legend = ['Month 1'];
      return config;
    case ChartFilterType.ThisQuarterToDate: // This Quarter to Date
      config.ChartTitle = 'This Quarter to Date';
      config.activeYear.startDate = moment().quarter(moment().quarter()).startOf('quarter').format('DD-MM-YYYY');
      config.activeYear.endDate = moment().format('DD-MM-YYYY');
      config.activeYear.lable = 'Q' + moment().quarter();

      config.lastYear.startDate = moment(config.activeYear.startDate, 'DD-MM-YYYY').quarter(moment().quarter()).startOf('quarter').subtract(1, 'quarter').format('DD-MM-YYYY');
      config.lastYear.endDate = moment(config.activeYear.startDate, 'DD-MM-YYYY').quarter(moment().quarter()).endOf('quarter').subtract(1, 'quarter').format('DD-MM-YYYY');
      config.lastYear.lable = 'Q' + moment(config.activeYear.startDate, 'DD-MM-YYYY').quarter(moment().quarter()).endOf('quarter').subtract(1, 'quarter').quarter();

      config.legend = ['Month 1', 'Month 2', 'Month 3'];
      return config;
    case ChartFilterType.ThisFinancialYearToDate: // This Financial Year to Date
      config.ChartTitle = 'This Financial Year to Date';
      let activeLegend = [];
      let lastLegend = [];
      if (activeFinancialYear) {
        config.activeYear.startDate = moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('day').format('DD-MM-YYYY');
        config.activeYear.endDate = moment(activeFinancialYear.financialYearEnds, 'DD-MM-YYYY').endOf('day').format('DD-MM-YYYY');
        config.activeYear.lable = 'FY-' + moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('day').format('YY') + ' - FY-' + moment(activeFinancialYear.financialYearEnds, 'DD-MM-YYYY').endOf('day').format('YY');

        let dateStart = moment(config.activeYear.startDate, 'DD-MM-YYYY');
        let dateEnd = moment(config.activeYear.endDate, 'DD-MM-YYYY');
        while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
          activeLegend.push(dateStart.format('MMM'));
          dateStart.add(1, 'month');
        }
      } else {
        config.activeYear.startDate = '00-00-0000';
        config.activeYear.endDate = '00-00-0000';
        config.activeYear.lable = '-None-';
      }

      if (lastFinancialYear) {
        config.lastYear.startDate = moment(lastFinancialYear.financialYearStarts, 'DD-MM-YYYY').subtract(1, 'year').startOf('day').format('DD-MM-YYYY');
        config.lastYear.endDate = moment(lastFinancialYear.financialYearEnds, 'DD-MM-YYYY').endOf('day').subtract(1, 'year').format('DD-MM-YYYY');
        config.lastYear.lable = 'FY-' + moment(lastFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('day').format('YY') + ' - FY-' + moment(lastFinancialYear.financialYearEnds, 'DD-MM-YYYY').endOf('day').format('YY');

        let dateStart = moment(config.lastYear.startDate, 'DD-MM-YYYY');
        let dateEnd = moment(config.lastYear.endDate, 'DD-MM-YYYY');
        while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
          lastLegend.push(dateStart.format('MMM'));
          dateStart.add(1, 'month');
        }
      } else {
        config.lastYear.startDate = '00-00-0000';
        config.lastYear.endDate = '00-00-0000';
        config.lastYear.lable = '-None-';
      }

      config.legend = _.uniq(activeLegend.concat(lastLegend));
      return config;
    case ChartFilterType.ThisYearToDate: // This Year to Date
      config.ChartTitle = 'This Year to Date';
      config.activeYear.startDate = moment().startOf('year').format('DD-MM-YYYY');
      config.activeYear.endDate = moment().format('DD-MM-YYYY');
      config.activeYear.lable = moment().format('YYYY');

      config.lastYear.startDate = moment(config.activeYear.startDate, 'DD-MM-YYYY').subtract(1, 'year').format('DD-MM-YYYY');
      config.lastYear.endDate = moment(config.activeYear.endDate, 'DD-MM-YYYY').endOf('year').subtract(1, 'year').format('DD-MM-YYYY');
      config.lastYear.lable = moment(config.activeYear.startDate, 'DD-MM-YYYY').subtract(1, 'year').format('YYYY');

      config.legend = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return config;
    case ChartFilterType.LastMonth: // Last Month
      config.ChartTitle = 'Last Month';
      config.activeYear.startDate = moment().startOf('month').subtract(1, 'month').format('DD-MM-YYYY');
      config.activeYear.endDate = moment().endOf('month').subtract(1, 'month').format('DD-MM-YYYY');
      config.activeYear.lable = moment().startOf('month').subtract(1, 'month').format('MMMM')

      config.lastYear.startDate = moment(config.activeYear.startDate, 'DD-MM-YYYY').startOf('month').subtract(1, 'month').format('DD-MM-YYYY');
      config.lastYear.endDate = moment(config.activeYear.endDate, 'DD-MM-YYYY').endOf('month').subtract(1, 'month').format('DD-MM-YYYY');
      config.lastYear.lable = moment(config.activeYear.endDate, 'DD-MM-YYYY').endOf('month').subtract(1, 'month').format('MMMM');

      config.legend = ['Month 1'];
      return config;
    case ChartFilterType.LastQuater: // Last Quater
      config.ChartTitle = 'Last Quater';
      config.activeYear.startDate = moment().quarter(moment().quarter()).startOf('quarter').subtract(1, 'quarter').format('DD-MM-YYYY');
      config.activeYear.endDate = moment().quarter(moment().quarter()).endOf('quarter').subtract(1, 'quarter').format('DD-MM-YYYY');
      config.activeYear.lable = 'Q' + moment().quarter(moment().quarter()).startOf('quarter').subtract(1, 'quarter').quarter();

      config.lastYear.startDate = moment().quarter(moment(config.activeYear.startDate, 'DD-MM-YYYY').quarter()).startOf('quarter').subtract(1, 'quarter').format('DD-MM-YYYY');
      config.lastYear.endDate = moment().quarter(moment(config.activeYear.startDate, 'DD-MM-YYYY').quarter()).endOf('quarter').subtract(1, 'quarter').format('DD-MM-YYYY');
      config.lastYear.lable = 'Q' + moment().quarter(moment(config.activeYear.startDate, 'DD-MM-YYYY').quarter()).endOf('quarter').subtract(1, 'quarter').quarter();

      config.legend = ['Month 1', 'Month 2', 'Month 3'];
      return config;
    case ChartFilterType.LastFiancialYear: {
      // Last Fiancial Year
      config.ChartTitle = 'Last Fiancial Year';
      let activeLegend = [];
      let lastLegend = [];
      if (activeFinancialYear) {
        config.activeYear.startDate = moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('year').subtract(1, 'year').format('DD-MM-YYYY');
        config.activeYear.endDate = moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').endOf('year').subtract(1, 'year').format('DD-MM-YYYY');
        config.activeYear.lable = 'FY-' + moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('year').subtract(1, 'year').format('YY') + ' - FY-' + moment(activeFinancialYear.financialYearEnds, 'DD-MM-YYYY').endOf('year').subtract(1, 'year').format('YY');

        let dateStart = moment(config.activeYear.startDate, 'DD-MM-YYYY');
        let dateEnd = moment(config.activeYear.endDate, 'DD-MM-YYYY');
        while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
          activeLegend.push(dateStart.format('MMM'));
          dateStart.add(1, 'month');
        }
      } else {
        config.activeYear.startDate = '00-00-0000';
        config.activeYear.endDate = '00-00-0000';
        config.activeYear.lable = '-None-';
      }

      if (lastFinancialYear) {
        config.lastYear.startDate = moment(lastFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('year').subtract(1, 'year').format('DD-MM-YYYY');
        config.lastYear.endDate = moment(lastFinancialYear.financialYearStarts, 'DD-MM-YYYY').endOf('year').subtract(1, 'year').format('DD-MM-YYYY');
        config.lastYear.lable = 'FY-' + moment(lastFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('year').subtract(1, 'year').format('YY') + ' - FY-' + moment(lastFinancialYear.financialYearEnds, 'DD-MM-YYYY').endOf('year').subtract(1, 'year').format('YY');

        let dateStart = moment(config.lastYear.startDate, 'DD-MM-YYYY');
        let dateEnd = moment(config.lastYear.endDate, 'DD-MM-YYYY');
        while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
          lastLegend.push(dateStart.format('MMM'));
          dateStart.add(1, 'month');
        }
      } else {
        config.lastYear.startDate = '00-00-0000';
        config.lastYear.endDate = '00-00-0000';
        config.lastYear.lable = '-None-';
      }
      config.legend = _.uniq(activeLegend.concat(lastLegend));
      return config;
    }
    case ChartFilterType.LastYear: // Last Year
      config.ChartTitle = 'Last Year';
      config.activeYear.startDate = moment().startOf('year').subtract(1, 'year').format('DD-MM-YYYY');
      config.activeYear.endDate = moment().endOf('year').subtract(1, 'year').format('DD-MM-YYYY');
      config.activeYear.lable = moment().startOf('year').subtract(1, 'year').format('YYYY');

      config.lastYear.startDate = moment(config.activeYear.startDate, 'DD-MM-YYYY').startOf('year').subtract(1, 'year').format('DD-MM-YYYY');
      config.lastYear.endDate = moment(config.activeYear.endDate, 'DD-MM-YYYY').endOf('year').subtract(1, 'year').format('DD-MM-YYYY');
      config.lastYear.lable = moment(config.activeYear.startDate, 'DD-MM-YYYY').startOf('year').subtract(1, 'year').format('YYYY');

      config.legend = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return config;
    case ChartFilterType.Custom:
      config.ChartTitle = 'Custom';

      config.activeYear.startDate = customFilterObj.activeYear.startDate;
      config.activeYear.endDate = customFilterObj.activeYear.endDate;
      config.activeYear.lable = `${customFilterObj.activeYear.startDate.slice(0, 5)} / ${customFilterObj.activeYear.endDate.slice(0, 5)}`;

      config.lastYear.startDate = customFilterObj.lastYear.startDate;
      config.lastYear.endDate = customFilterObj.lastYear.startDate;
      config.lastYear.lable = `${customFilterObj.lastYear.startDate.slice(0, 5)} / ${customFilterObj.lastYear.endDate.slice(0, 5)}`;

      config.legend = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return config;
    default:
      return config;
  }
};
