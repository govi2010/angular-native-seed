import { INameUniqueName } from './nameUniqueName.interface';
import { IPagination } from './paginatedResponse.interface';
import { IFlattenAccountsResultItem } from './flattenAccountsResultItem.interface';

/**
 * interface used in transaction item everywhere
 */

export class BlankLedgerVM {
  public transactions: TransactionVM[];
  public voucherType: string;
  public entryDate: string;
  public unconfirmedEntry: boolean;
  public attachedFile: string;
  public attachedFileName?: string;
  public tag: any;
  public description: string;
  public generateInvoice: boolean;
  public chequeNumber: string;
  public chequeClearanceDate: string;
  public compoundTotal: number;
  public isBankTransaction?: boolean;
  public transactionId?: string;
  public invoiceNumberAgainstVoucher: string;
}

export class TransactionVM {
  public id?: string;
  public amount: number;
  public particular: string;
  public applyApplicableTaxes: boolean;
  public isInclusiveTax: boolean;
  public type: string;
  public taxes: string[];
  public tax?: number;
  public total: number;
  public discounts: ILedgerDiscount[];
  public discount?: number;
  public selectedAccount?: IFlattenAccountsResultItem | any;
  public unitRate?: IInventoryUnit[];
  public isStock?: boolean = false;
  public inventory?: IInventory;
}

export interface IInventory {
  amount: number;
  quantity: number;
  rate: number;
  stock?: INameUniqueName;
  unit: IInventoryUnit;
}

export interface IInventoryUnit {
  stockUnitCode: string;
  code: string;
  rate: number;
}
export interface ILedgerTransactionItem {
  amount: number;
  date?: string;
  isStock?: boolean;
  inventory?: IInventory;
  isTax?: boolean;
  isBaseAccount?: boolean;
  particular: INameUniqueName;
  type: string;
  selectedAccount?: IFlattenAccountsResultItem | any;
  unitRate?: IInventoryUnit[];
  isUpdated?: boolean;
}

export interface IUnit {
  name?: string;
  code?: string;
  hierarchicalQuantity?: number;
  parentStockUnit?: any;
  quantityPerUnit?: number;
}

export interface IInvoiceRequest {
  invoice: IInvoice;
}

export interface IInvoiceTransactionItem {
  accountUniqueName: string;
  description?: string;
}

export interface IInvoiceEntryItem {
  transactions: IInvoiceTransactionItem[];
}

export interface IInvoice {
  entries: IInvoiceEntryItem[];
}

export interface ILedger {
  applyApplicableTaxes?: boolean;
  attachedFile?: string;
  attachedFileName?: string;
  compoundTotal?: number;
  chequeNumber?: string;
  chequeClearanceDate?: string;
  description?: string;
  entryDate: string;
  generateInvoice?: boolean;
  isInclusiveTax?: boolean;
  tag?: string;
  taxes?: string[];
  transactions: ILedgerTransactionItem[];
  unconfirmedEntry?: boolean;
  voucher: IVoucherItem;
  voucherType?: string;
}

export interface ITransactions extends IPagination {
  closingBalance: IClosingBalance;
  creditTotal: number;
  creditTransactions: ITransactionItem[];
  creditTransactionsCount: number;
  debitTotal: number;
  debitTransactions: ITransactionItem[];
  debitTransactionsCount: number;
  forwardedBalance: IForwardBalance;
}

export interface IClosingBalance {
  amount: number;
  type: string;
}

export interface IForwardBalance extends IClosingBalance {
  description?: string;
}

export interface ITransactionItem {
  amount: number;
  attachedFileName: string;
  attachedFileUniqueName: string;
  chequeClearanceDate: string;
  chequeNumber: string;
  description: string;
  entryCreatedAt: string;
  entryDate: string;
  entryUniqueName: string;
  inventory?: IInventory;
  invoiceNumber: string;
  isBaseAccount: boolean;
  isCompoundEntry: boolean;
  isInvoiceGenerated: boolean;
  isTax: boolean;
  particular: INameUniqueName;
  type: string;
  unconfirmedEntry: boolean;
  selectedAccount?: IFlattenAccountsResultItem | any;
}

/**
 * interface used in create ledger request and response
 */
export interface IVoucherItem {
  name: string;
  shortCode: string;
}

/**
 * interface used in create ledger entry request and response
 */
export interface ITotalItem {
  amount: number;
  type: string;
}

export interface ILedgerDiscount {
  name: string;
  particular: string;
  amount: number;
  type?: string;
}
