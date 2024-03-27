import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { GetKpiResponse,GetProductResponse, GetFirstTransactionResponse,GetTransactionResponse } from "./types";


export const api = createApi({
    baseQuery:fetchBaseQuery({baseUrl:import.meta.env.VITE_BASE_URL}),
    reducerPath:"main",
    tagTypes:["Kpis", "Products","LastTransactions","FirstTransactions"],
    endpoints:(build) => ({
        getKpis: build.query <Array<GetKpiResponse>,void> ({
            query:()=>"kpi/kpis/",
            providesTags:["Kpis"]
        }),
        getProducts: build.query <Array<GetProductResponse>,void> ({
            query:()=>"product/products/",
            providesTags:["Products"],
        }),
        getLastTransactions: build.query <Array<GetTransactionResponse>,void> ({
            query:()=>"transaction/latestTransactions/",
            providesTags:["LastTransactions"],
        }),
        
        getFirstTransactions:build.query<Array<GetFirstTransactionResponse>,void> ({
            query:() =>"transaction/firstTransactions/",
            providesTags:["FirstTransactions"],
        })
    }),

})

export const {useGetKpisQuery,useGetProductsQuery, useGetFirstTransactionsQuery,useGetLastTransactionsQuery }=api;