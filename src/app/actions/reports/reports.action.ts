import { Actions, Effect } from "@ngrx/effects";
import { DashboardService } from "../../services/dashboard.service";
import { CustomActions } from "../../store/customActions";
import { Observable } from "rxjs/Observable";
import { ChartFilterType, IProfitLossChartResponse } from "../../models/interfaces/dashboard.interface";
import { Injectable } from "@angular/core";
import { zip } from "rxjs/observable/zip";
import * as _ from 'lodash';
import * as moment from 'moment/moment';
import { ChartFilterConfigs, ChartCustomFilter } from "../../models/api-models/Dashboard";
import { ActiveFinancialYear } from "../../models/api-models/Company";
import { AppState } from "../../store";
import { createSelector, Store } from "@ngrx/store";

import { of } from "rxjs/observable/of";
import { ReportConst } from "../../actions/reports/reports.const";
import { TlPlService } from "../../services/tl-pl.service";
import { BalanceSheetRequest, ProfitLossRequest } from "../../models/api-models/tb-pl-bs";

@Injectable()
export class ReportsAction {
  @Effect()
  public GetProfitLossChartActiveYear$: Observable<CustomActions> = this.actions$
    .ofType(ReportConst.PROFIT_LOSS_CHART.GET_PROFIT_LOSS_CHART_DATA_ACTIVE_YEAR)
    .switchMap((action: CustomActions) => {
      let filterType: ChartFilterType;
      let activeFinancialYear: ActiveFinancialYear;
      let lastFinancialYear: ActiveFinancialYear;
      let customFilterObj: ChartCustomFilter;
      this.store.select(p => p.report.profitLossCustomFilter).take(1).subscribe(p => customFilterObj = p);
      this.store.select(s => s.report.profitLossChartFilter).take(1).subscribe(p => filterType = p);
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
      let op = parseDates(filterType, activeFinancialYear, lastFinancialYear, customFilterObj);
      return zip(
        this._dashboardService.Dashboard(op.activeYear.startDate, op.activeYear.endDate, 'monthly', action.payload.refresh),
        of(op)
      );
    }).map((res) => {
      if (res[0].status === 'success') {
        let obj: IProfitLossChartResponse = {
          profitLossActiveYear: res[0].body.profitLoss,
          lable: { activeYearLabel: res[1].activeYear.lable },
          chartTitle: res[1].ChartTitle,
          legend: res[1].legend
        };
        return {
          type: ReportConst.PROFIT_LOSS_CHART.GET_PROFIT_LOSS_CHART_DATA_ACTIVE_YEAR_RESPONSE,
          payload: obj
        };
      }
      else {
        let obj: IProfitLossChartResponse = {
          profitLossActiveYear: null,
          lable: { activeYearLabel: res[1].activeYear.lable },
          chartTitle: res[1].ChartTitle,
          legend: res[1].legend
        };
        return {
          type: ReportConst.PROFIT_LOSS_CHART.GET_PROFIT_LOSS_CHART_DATA_ACTIVE_YEAR_RESPONSE,
          payload: obj
        };
      }
    });

  @Effect()
  public GetProfitLossChartLastYear$: Observable<CustomActions> = this.actions$
    .ofType(ReportConst.PROFIT_LOSS_CHART.GET_PROFIT_LOSS_CHART_DATA_LAST_YEAR)
    .switchMap((action: CustomActions) => {
      let filterType: ChartFilterType;
      let activeFinancialYear: ActiveFinancialYear;
      let lastFinancialYear: ActiveFinancialYear;
      let customFilterObj: ChartCustomFilter;
      this.store.select(p => p.report.profitLossChartFilter).take(1).subscribe(p => filterType = p);
      this.store.select(p => p.report.profitLossCustomFilter).take(1).subscribe(p => customFilterObj = p);
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
      let op = parseDates(filterType, activeFinancialYear, lastFinancialYear, customFilterObj);
      return zip(
        this._dashboardService.Dashboard(op.lastYear.startDate, op.lastYear.endDate, 'monthly', action.payload.refresh),
        of(op)
      );
    }).map((res) => {
      if (res[0].status === 'success') {
        let obj: IProfitLossChartResponse = {
          profitLossLastYear: res[0].body.profitLoss,
          lable: { lastYearLabel: res[1].lastYear.lable },
          chartTitle: res[1].ChartTitle,
        };
        return {
          type: ReportConst.PROFIT_LOSS_CHART.GET_PROFIT_LOSS_CHART_DATA_LAST_YEAR_RESPONSE,
          payload: obj
        };
      } else {
        let obj: IProfitLossChartResponse = {
          profitLossLastYear: null,
          lable: { lastYearLabel: res[1].lastYear.lable },
          chartTitle: res[1].ChartTitle,
        };
        return {
          type: ReportConst.PROFIT_LOSS_CHART.GET_PROFIT_LOSS_CHART_DATA_LAST_YEAR_RESPONSE,
          payload: obj
        };
      }
    });

  @Effect() private GetProfitLoss$: Observable<CustomActions> = this.actions$
    .ofType(ReportConst.PROFIT_LOSS_SHEET.GET_PROFIT_LOSS_SHEET_REQUEST)
    .switchMap((action: CustomActions) => {
      let filterType: ChartFilterType;
      let fyIndex: number;
      let activeFinancialYear: ActiveFinancialYear;
      let customFilterObj: ChartCustomFilter;
      this.store.select(p => p.report.profitLossCustomFilter).take(1).subscribe(p => customFilterObj = p);
      this.store.select(p => p.report.profitLossChartFilter).take(1).subscribe(p => filterType = p);
      this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
        return { companies, uniqueName };
      })).take(1).subscribe(res => {
        if (!res.companies) {
          return;
        }
        let activeCmp = res.companies.find(p => p.uniqueName === res.uniqueName);
        if (activeCmp) {
          activeFinancialYear = activeCmp.activeFinancialYear;
          fyIndex = activeCmp.financialYears.findIndex(f => f.uniqueName === activeFinancialYear.uniqueName);
        }
      });
      let op = parseDates(filterType, activeFinancialYear, null, customFilterObj);
      let request: ProfitLossRequest = {
        refresh: action.payload,
        from: op.activeYear.startDate,
        to: op.activeYear.endDate,
        fy: fyIndex === 0 ? 0 : fyIndex * -1
      };
      return zip(this._tlPlService.GetProfitLoss(request), of(op));
    })
    .map(response => {
      if (response[0].status === 'success') {
        return {
          type: ReportConst.PROFIT_LOSS_SHEET.GET_PROFIT_LOSS_SHEET_RESPONSE,
          payload: response[0]
        };
      }
      return {
        type: 'EmptyActions'
      }
    });

  @Effect() private GetBalanceSheet$: Observable<CustomActions> = this.actions$
    .ofType(ReportConst.BALANCE_SHEET.GET_BALANCE_SHEET_REQUEST)
    .switchMap((action: CustomActions) => {
      let filterType: ChartFilterType;
      let fyIndex: number;
      let activeFinancialYear: ActiveFinancialYear;
      let customFilterObj: ChartCustomFilter;
      this.store.select(p => p.report.profitLossCustomFilter).take(1).subscribe(p => customFilterObj = p);
      this.store.select(p => p.report.profitLossChartFilter).take(1).subscribe(p => filterType = p);
      this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
        return { companies, uniqueName };
      })).take(1).subscribe(res => {
        if (!res.companies) {
          return;
        }
        let activeCmp = res.companies.find(p => p.uniqueName === res.uniqueName);
        if (activeCmp) {
          activeFinancialYear = activeCmp.activeFinancialYear;
          fyIndex = activeCmp.financialYears.findIndex(f => f.uniqueName === activeFinancialYear.uniqueName);
        }
      });
      let op = parseDates(filterType, activeFinancialYear, null, customFilterObj);
      let request: BalanceSheetRequest = {
        refresh: action.payload,
        from: op.activeYear.startDate,
        to: op.activeYear.endDate,
        fy: fyIndex === 0 ? 0 : fyIndex * -1
      };
      return zip(this._tlPlService.GetBalanceSheet(request), of(op));
    })
    .map(response => {
      if (response[0].status === 'success') {
        return {
          type: ReportConst.BALANCE_SHEET.GET_BALANCE_SHEET_RESPONSE,
          payload: response[0]
        };
      }
      return {
        type: 'EmptyActions'
      }
    });

  constructor(private actions$: Actions, private _dashboardService: DashboardService, private store: Store<AppState>,
    private _tlPlService: TlPlService) {

  }

  public getProfitLossChartActiveYear(refresh: boolean = false): CustomActions {
    return {
      type: ReportConst.PROFIT_LOSS_CHART.GET_PROFIT_LOSS_CHART_DATA_ACTIVE_YEAR,
      payload: { refresh }
    };
  }

  public getProfitLossChartLastYear(refresh: boolean = false): CustomActions {
    return {
      type: ReportConst.PROFIT_LOSS_CHART.GET_PROFIT_LOSS_CHART_DATA_LAST_YEAR,
      payload: { refresh }
    };
  }

  public setProfitLossChartFilter(filterType: ChartFilterType, customFilterObj: ChartCustomFilter): CustomActions {
    return {
      type: ReportConst.SET_PROFIT_LOSS_CHART_FILTER_TYPE,
      payload: { filterType, customFilterObj }
    };
  }

  public getProfitLossSheet(refresh: boolean): CustomActions {
    return {
      type: ReportConst.PROFIT_LOSS_SHEET.GET_PROFIT_LOSS_SHEET_REQUEST,
      payload: refresh
    };
  }

  public getBalanceSheet(refresh: boolean): CustomActions {
    return {
      type: ReportConst.BALANCE_SHEET.GET_BALANCE_SHEET_REQUEST,
      payload: refresh
    };
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
      config.activeYear.lable = `${customFilterObj.activeYear.startDate.slice(0,5)} / ${customFilterObj.activeYear.endDate.slice(0,5)}`;

      config.lastYear.startDate = customFilterObj.lastYear.startDate;
      config.lastYear.endDate = customFilterObj.lastYear.startDate;
      config.lastYear.lable = `${customFilterObj.lastYear.startDate.slice(0,5)} / ${customFilterObj.lastYear.endDate.slice(0,5)}`;

      config.legend = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return config;
    default:
      return config;
  }
};
