import { CustomActions } from "~/store/customActions";
import { ChartFilterType, IReportChartData } from "~/models/interfaces/dashboard.interface";
import { NewReportConst } from "~/actions/new-reports/new-reports.const";
import { GroupHistoryResponse, CategoryHistoryResponse, ChartFilterConfigs } from "~/models/api-models/Dashboard";
import * as _ from 'lodash';
import * as moment from 'moment/moment';

export interface NewReportsState {
  currentData: IReportChartData,
  previousData: IReportChartData,
  profitLossChartFilter: ChartFilterType,
}

const initialState: NewReportsState = {
  currentData: {
    incomeData: null,
    expensesData: null,
    legend: [],
    from: '',
    to: ''
  },
  previousData: {
    incomeData: null,
    expensesData: null,
    legend: [],
    from: '',
    to: ''
  },
  profitLossChartFilter: ChartFilterType.ThisQuarterToDate
};

export function NewReportsReducer(state: NewReportsState = initialState, action: CustomActions): NewReportsState {
  switch (action.type) {
    //#region Income Data
    case NewReportConst.PROFIT_LOSS_CHART.GET_INCOME_DATA_RESPONSE: {
      let payload: { data: CategoryHistoryResponse, config: ChartFilterConfigs } = action.payload;
      let currentIncomeData;
      let previousIncomeData;

      currentIncomeData = Object.assign({}, payload.data, {
        intervalBalances: payload.data.intervalBalances.filter(ip => {
          return moment(ip.from, 'YYYY-MM-DD').isAfter(moment(payload.config.lastYear.endDate, 'DD-MM-YYYY'))
        })
      })

      previousIncomeData = Object.assign({}, payload.data, {
        intervalBalances: payload.data.intervalBalances.filter(ip => {
          return moment(ip.from, 'YYYY-MM-DD').isBefore(moment(payload.config.activeYear.startDate, 'DD-MM-YYYY'))
        })
      });

      return Object.assign({}, state, {
        currentData: Object.assign({}, state.currentData, {
          incomeData: currentIncomeData,
          legend: payload.config.legend,
          from: payload.config.activeYear.startDate,
          to: payload.config.activeYear.endDate
        }),
        previousData: Object.assign({}, state.previousData, {
          incomeData: previousIncomeData,
          legend: payload.config.legend,
          from: payload.config.lastYear.startDate,
          to: payload.config.lastYear.endDate
        })
      });
    }

    case NewReportConst.PROFIT_LOSS_CHART.GET_INCOME_DATA_ERROR: {
      return Object.assign({}, state, {
        currentData: Object.assign({}, state.currentData, {
          incomeData: null,
          legend: [],
          from: '',
          to: ''
        }),
        previousData: Object.assign({}, state.currentData, {
          incomeData: null,
          legend: [],
          from: '',
          to: ''
        })
      });
    }
    //#endregion

    //#region Expenses Data
    case NewReportConst.PROFIT_LOSS_CHART.GET_EXPENSES_DATA_RESPONSE: {
      let payload: { data: GroupHistoryResponse, config: ChartFilterConfigs } = action.payload;
      let currentExpenseData;
      let previousExpenseData;

      currentExpenseData = Object.assign({}, payload.data, {
        groups: payload.data.groups.map(fa => {
          let intervalBalances = fa.intervalBalances.filter(fil => {
            return moment(fil.from, 'YYYY-MM-DD').isAfter(moment(payload.config.lastYear.endDate, 'DD-MM-YYYY'))
          });
          return Object.assign({}, fa, {
            intervalBalances
          });
        })
      });

      previousExpenseData = Object.assign({}, payload.data, {
        groups: payload.data.groups.map(fa => {
          let intervalBalances = fa.intervalBalances.filter(fil => {
            return moment(fil.from, 'YYYY-MM-DD').isBefore(moment(payload.config.activeYear.startDate, 'DD-MM-YYYY'))
          });
          return Object.assign({}, fa, {
            intervalBalances
          });
        })
      });

      return Object.assign({}, state, {
        currentData: Object.assign({}, state.currentData, {
          expensesData: currentExpenseData,
          legend: payload.config.legend,
          from: payload.config.activeYear.startDate,
          to: payload.config.activeYear.endDate
        }),
        previousData: Object.assign({}, state.previousData, {
          expensesData: previousExpenseData,
          legend: payload.config.legend,
          from: payload.config.lastYear.startDate,
          to: payload.config.lastYear.endDate
        })
      });
    }

    case NewReportConst.PROFIT_LOSS_CHART.GET_EXPENSES_DATA_ERROR: {
      return Object.assign({}, state, {
        currentData: Object.assign({}, state.currentData, {
          expensesData: null,
          legend: [],
          from: '',
          to: ''
        }),
        previousData: Object.assign({}, state.currentData, {
          expensesData: null,
          legend: [],
          from: '',
          to: ''
        })
      });
    }
    //#endregion
    default:
      break;
  }
  return state;
}
