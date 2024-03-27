
export interface ExpensesByCategory{
    salaries:number;
    supplies:number;
    services:number;
}

export interface Month{
    id:string;
    month:string;
    revenue:number;
    nonOperationalExpenses:number;
    operationalExpenses:number;
    expenses:number;
}

export interface Day{
    id:string;
    date:string;
    revenue:number;
    expenses:number;
}



export interface GetKpiResponse {
    id:string;
    _id:string;
    __v:number;
    totalProfit:number;
    totalRevenue:number;
    totalExpenses:number;
    expensesByCategory:ExpensesByCategory;
    updatedAt:string;
    createdAt:string;
    monthlyData:Array<Month>;
    dailData:Array<Day>;
}


export interface GetProductResponse {
    id:string;
    _id:string;
    __v:number;
    price:number;
    expense:number;
    transactions:Array<string>;
    createdAt:string;
    updatedAt:string;
}

export interface GetTransactionResponse {
    id:string;
    _id:string;
    __v:number;
    buyer:number;
    amount:number;
    productIds:Array<string>;
    createdAt:string;
    updatedAt:string;
}

export interface GetFirstTransactionResponse{
    id:string;
    _id:string;
    __v:number;
    buyer:number;
    amount:number;
    productIds:Array<string>;
    createdAt:string;
    updatedAt:string;
}

export interface OperationalExpensesStatus {
    operationalMin:number,
    operationalQ1:number,
    operationalMedian:number,
    operationalQ3:number,
    operationalMax:number,
}

export interface nonOperationalExpensesStatus{
    nonOperationalMin:number,
    nonOperationalQ1:number,
    nonOperationalMedian:number,
    nonOperationalQ3:number,
    nonOperationalMax:number,
}


export interface monthlyDataItem {
    month:string,
    revenue:number,
    operationalExpenses:number,
    nonOperationalExpenses:number,
    expenses:number
   
}


export interface Financials {
    profitMarginValue:number,
    superavitOrDeficit:number
}
