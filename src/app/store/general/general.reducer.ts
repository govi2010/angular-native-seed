import { CustomActions } from "../../store/customActions";
import { IContriesWithCodes } from "../../shared/static-data/countryWithCodes";
import { GeneralConst } from "../../actions/general/general.const";
import { States } from "../../models/api-models/Company";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { IFlattenAccountsResultItem } from "../../models/interfaces/flattenAccountsResultItem.interface";
import { FlattenAccountsResponse } from "../../models/api-models/Account";
import { MyDrawerItem } from "../../shared/my-drawer-item/my-drawer-item";

const initialNavObj: MyDrawerItem[] = [
    {
        title: 'Back',
        icon: String.fromCharCode(0xf060),
        needTopHr: true,
        router: '/home',
        fontFamily: 'FontAwesome',
    } as MyDrawerItem,
    {
        title: 'Home',
        icon: String.fromCharCode(0x66),
        needTopHr: true,
        fontFamily: '1515160234',
        router: '/home'
    } as MyDrawerItem,
    {
        title: 'Dashboard',
        icon: String.fromCharCode(0x64),
        needTopHr: true,
        fontFamily: '1515160234',
        router: '/dashboard'
    } as MyDrawerItem,
    {
        title: 'Trial Balance',
        icon: String.fromCharCode(0x63),
        needTopHr: true,
        fontFamily: '1515160234',
        router: '/tb'
    } as MyDrawerItem,
    {
        title: 'Sales Invoice',
        icon: String.fromCharCode(0x6a),
        needTopHr: true,
        fontFamily: '1515160234',
        router: '/sale'
    } as MyDrawerItem,
    // {
    //     title: 'Purchase Invoice',
    //     icon: String.fromCharCode(0x6b),
    //     needTopHr: true,
    //     fontFamily: '1515160234',
    //     router: '/purchase'
    // } as MyDrawerItem,
    {
        title: 'Reports',
        icon: String.fromCharCode(0x69),
        needTopHr: true,
        fontFamily: '1515160234',
        router: '/reports'
    } as MyDrawerItem,
    {
        title: 'Settings',
        icon: String.fromCharCode(0x6c),
        needTopHr: true,
        fontFamily: '1515160234',
        router: '/settings'
    } as MyDrawerItem,
];

const initialCurrenciesData: string[] = [
    "USD",
    "CAD",
    "EUR",
    "AED",
    "AFN",
    "ALL",
    "AMD",
    "ARS",
    "AUD",
    "AZN",
    "BAM",
    "BDT",
    "BGN",
    "BHD",
    "BIF",
    "BND",
    "BOB",
    "BRL",
    "BWP",
    "BYR",
    "BZD",
    "CDF",
    "CHF",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EEK",
    "EGP",
    "ERN",
    "ETB",
    "GBP",
    "GEL",
    "GHS",
    "GNF",
    "GTQ",
    "HKD",
    "HNL",
    "HRK",
    "HUF",
    "IDR",
    "ILS",
    "INR",
    "IQD",
    "IRR",
    "ISK",
    "JMD",
    "JOD",
    "JPY",
    "KES",
    "KHR",
    "KMF",
    "KRW",
    "KWD",
    "KZT",
    "LBP",
    "LKR",
    "LTL",
    "LVL",
    "LYD",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MOP",
    "MUR",
    "MXN",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PAB",
    "PEN",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SAR",
    "SDG",
    "SEK",
    "SGD",
    "SOS",
    "SYP",
    "THB",
    "TND",
    "TOP",
    "TRY",
    "TTD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "UYU",
    "UZS",
    "VEF",
    "VND",
    "XAF",
    "XOF",
    "YER",
    "ZAR",
    "ZMK"
];

export interface GeneralState {
    navDrawerObj: MyDrawerItem[];
    contriesWithCodes: IContriesWithCodes[];
    flattenAccounts: IFlattenAccountsResultItem[];
    states: States[];
    currencies: string[];
}

const initialState: GeneralState = {
    navDrawerObj: initialNavObj,
    contriesWithCodes: [],
    states: null,
    flattenAccounts: null,
    currencies: initialCurrenciesData
};

export function GeneralReducer(state: GeneralState = initialState, action: CustomActions): GeneralState {
    switch (action.type) {
        case GeneralConst.SET_COUNTRIES_WITH_CODES: {
            return Object.assign({}, state, {
                contriesWithCodes: action.payload
            })
        }

        case GeneralConst.GET_ALL_STATES_RESPONSE: {
            let result: BaseResponse<States[], string> = action.payload;
            if (result.status === 'success') {
                return Object.assign({}, state, {
                    states: result.body
                })
            }
            return state;
        }

        case GeneralConst.GET_FLATTEN_ACCOUNTS_RESPONSE: {
            let result: BaseResponse<FlattenAccountsResponse, string> = action.payload;
            if (result.status === 'success') {
                return Object.assign({}, state, {
                    flattenAccounts: result.body.results
                });
            }
            return state;
        }
        default:
            return state;
    }
}
