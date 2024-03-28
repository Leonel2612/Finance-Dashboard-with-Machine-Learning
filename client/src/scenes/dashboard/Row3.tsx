import DashboardBox from '@/components/DashboardBox'
import { useGetFirstTransactionsQuery, useGetProductsQuery, useGetLastTransactionsQuery } from '@/state/api'
import { useMemo, useState } from 'react'
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import BoxHeader from '@/components/BoxHeader';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import React from "react";
import { AgChartsReact } from "ag-charts-react";
import { AgChartOptions} from "ag-charts-community";
import { ResponsiveContainer } from 'recharts';

const ChartBubleLastAndFirst = ({
  statsFirstTransactions,
  statsLastTransactions,
}) => {
  const {palette}= useTheme()
  const [options] = useState<AgChartOptions>({
    autoSize:true,
    
    background: {
      fill:palette.background.default
    },
    title: {
      text: "First Transactions vs Last Transactions",
      color:"#B3B6C2"
      
    },
    subtitle: {
      text: "Based on Transaction Amount",
      color:"#B3B6C2"
    },
    series: [
      {
        type: "bubble",
        title: "First Transactions",
        data: statsFirstTransactions,
        xKey: "amount",
        xName: "Money",
        yKey: "productIds",
        yName: "Count",
        sizeKey: "totalAmount",
        sizeName: "Total amount of money", 
        labelKey:"buyer"
      },
      {
        type: "bubble",
        title: "Last Transactions",
        data: statsLastTransactions,
        xKey: "amount",
        xName: "Money",
        yKey: "productIds",
        yName: "Count",
        sizeKey: "totalAmount",
        sizeName: "Total amount of money",
        labelKey:"buyer"

      },
    ],
    axes: [
      {
        type: "number",
        position: "bottom",
        title: {
          text: "Amount Of Money",
          color:"#B3B6C2"
        },
        label: {
          formatter: (params) => {
            return params.value + "$";
          },
          color:"#6b6d74"
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Amount Of Products sold",
          color:"#B3B6C2"
        },

        label: {
          formatter: (params) => {
            return params.value + "";
          },
          color:"#6b6d74"
        },
      },
    ],


    legend:{
      item:{
        label:{
          color:"#B3B6C2"
        }
      }
    }

  });


  return <AgChartsReact  options={options} />;
};


const Row3 = () => {
  const {data:lastTransactionsData}=useGetLastTransactionsQuery();
  const{data:productData}=useGetProductsQuery();
  const {data:firstTransactionsData} = useGetFirstTransactionsQuery();  
  const {palette}=useTheme();

  const isAboveMediumScreens = useMediaQuery("(min-width:1200px)")

  const expensesAndPrice=useMemo(()=>{
    return(
      productData&&
      productData.map(({id,price,expense})=>{
        return{
          id:id,
          price:price,
          expense:expense
        }
      })
    )

  },[productData])


  const column=[
    { field: 'id', headerName: 'ID', flex:1},
    {
      field: 'expense',
      headerName: 'Expense',
      flex:0.5,
      renderCell:(params:GridCellParams)=>`$${params.value}`
    },
    {
      field: 'price',
      headerName: 'Price',
      flex:0.5,
      renderCell:(params:GridCellParams)=>`$${params.value}`      
    }
  ]

  const columnTransactions=[
    { field: 'id', headerName: 'ID', flex:1},
    {
      field: 'buyer',
      headerName: 'Buyer',
      flex:0.5,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex:0.5,
      renderCell:(params:GridCellParams)=>`$${params.value}`      
    },
    {
      field: 'productIds',
      headerName: 'Count',
      flex:0.1,
      renderCell:(params:GridCellParams)=>(params.value as Array<string> ).length
    }
  ]

    
    const statsFirstTransactions = useMemo(()=>{
      return (
        firstTransactionsData && 
        firstTransactionsData.map(({buyer,amount,productIds})=>{
          return{
            buyer:buyer,
            amount:amount,
            productIds:productIds.length,
            totalAmount:parseFloat(((productIds.length)*amount).toFixed(2))
          }
        }))
    },[firstTransactionsData])
    

    const statsLastTransactions = useMemo(()=>{
      return (
        lastTransactionsData &&
        lastTransactionsData.map(({buyer,amount,productIds})=>{
          return{
            buyer:buyer,
            amount:amount,
            productIds:productIds.length,
            totalAmount:parseFloat(((productIds.length)*amount).toFixed(2))
          }
        })
      )


    },[lastTransactionsData])

    return (
      <>
            <DashboardBox  gridArea="g"> 
            <BoxHeader title='List of products' sideText={`${productData?.length} products`}/>
              <Box
                mt="0.3rem"
                p="0 0.5rem"
                height="70%"
                sx={{
                  "& .MuiDataGrid-root":{
                    color:palette.grey[300],
                    border:"none"
                  },
                  "& .MuiDataGrid-cell":{
                    borderBottom:`1px solid ${palette.grey[800]} !important`
                  },

                  "& .MuiDataGrid-columnHeaders":{
                    borderBottom:`1px solid ${palette.grey[800]} !important`

                  },
                  "& .MuiDataGrid-columnSeparator":{
                    visibility:"hidden"
                  },
                }}
              >
              <DataGrid
                columnHeaderHeight={25}
                rowHeight={35}
                hideFooter={true}
                rows={expensesAndPrice||[]}
                columns={column}
              />
              </Box>
            </DashboardBox>
          
            <DashboardBox  gridArea="h"> 
            <BoxHeader title='Last and First Transactions' sideText="+5%"/>
              <Box
              height="83%"
    
              >
              {
                statsFirstTransactions && statsLastTransactions ? (
                  <ChartBubleLastAndFirst
                  statsFirstTransactions={statsFirstTransactions}
                  statsLastTransactions={statsLastTransactions}
                  /> 
                )
                :
                (null)
              }
              </Box>
           
              </DashboardBox>
            <DashboardBox  gridArea="i">
              
            <BoxHeader title='Orders' sideText={`${lastTransactionsData?.length} lastest transactions`}/>      
              
            <ResponsiveContainer height="70%" width="100%">
              <Box
              mt= {isAboveMediumScreens ? "1rem" : ""}
                p="0 0.5rem"
                height="100%"
                sx={{
                  "& .MuiDataGrid-root":{
                    color:palette.grey[300],
                    border:"none"
                  },
                  "& .MuiDataGrid-cell":{
                    borderBottom:`1px solid ${palette.grey[800]} !important`
                  },

                  "& .MuiDataGrid-columnHeaders":{
                    borderBottom:`1px solid ${palette.grey[800]} !important`

                  },
                  "& .MuiDataGrid-columnSeparator":{
                    visibility:"hidden"
                  },
                }}
              >
              <DataGrid
                columnHeaderHeight={25}
                rowHeight={35}
                hideFooter={true}
                rows={lastTransactionsData||[]}
                columns={columnTransactions}
              />
              </Box>
            
              </ResponsiveContainer>
            </DashboardBox>
      </>
    )
}

export default Row3
