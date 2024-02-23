import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { GetKpiResponse,GetProductResponse, GetTransactionResponse } from "./types";


export const api = createApi({
    baseQuery:fetchBaseQuery({baseUrl:import.meta.env.VITE_BASE_URL}),
    reducerPath:"main",
    tagTypes:["Kpis", "Products","Transactions"],
    endpoints:(build) => ({
        getKpis: build.query <Array<GetKpiResponse>,void> ({
            query:()=>"kpi/kpis/",
            providesTags:["Kpis"]
        }),
        getProducts: build.query <Array<GetProductResponse>,void> ({
            query:()=>"product/products/",
            providesTags:["Products"],
        }),
        getTransactions: build.query <Array<GetTransactionResponse>,void> ({
            query:()=>"transaction/transactions/",
            providesTags:["Transactions"],
        })
    }),
})

export const {useGetKpisQuery,useGetProductsQuery,useGetTransactionsQuery }=api;