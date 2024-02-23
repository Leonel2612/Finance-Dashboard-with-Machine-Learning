import DashboardBox from '@/components/DashboardBox'
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from '@/state/api'
import { useMemo } from 'react'
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import BoxHeader from '@/components/BoxHeader';
import { Box, Typography, useTheme } from '@mui/material';
import { Pie, PieChart,Cell } from 'recharts';
import FlexBetween from '@/components/FlexBetween';




const Row3 = () => {
  const {data:kpiData}=useGetKpisQuery();
  const {data:transactionsData}=useGetTransactionsQuery();
  const{data:productData}=useGetProductsQuery();
  
  const {palette}=useTheme();
  const pieColors=[palette.primary[800],palette.primary[500]]


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

  const pieChartData=useMemo(()=>{
    if (kpiData){
      const totalExpenses=kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(
          ([key,value])=>{
            return[{
                name:key,
                value:value
            },
            {
              name:`${key} of Total`,
              value:totalExpenses-value
            }
          ]
        } 
      )
    }
  },[kpiData])


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


    
  
  console.log("transactions",kpiData)

    return (
      <>
            <DashboardBox  gridArea="g"> 
            <BoxHeader title='List of products' sideText={`${productData?.length} products`}/>
              <Box
                mt="0.5rem"
                p="0 0.5rem"
                height="75%"
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
            <BoxHeader title='Orders' sideText={`${transactionsData?.length} lastest transactions`}/>
              <Box
                mt="1rem"
                p="0 0.5rem"
                height="80%"
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
                rows={transactionsData||[]}
                columns={columnTransactions}
              />
              </Box>
            
                
            </DashboardBox>
            <DashboardBox  gridArea="i">
              
                <BoxHeader title="Expense BreakDown By Category" sideText='+4%'/>
                <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
                
                {
                  pieChartData?.map((data,i)=>(
                    <Box key={`${data[0].name}-${i}`}>
                      <PieChart 
                      width={110}
                      height={80}
                      margin={{
                          top: 0,
                          right:4,
                          left:1,
                          bottom: 0,
                      }}
                      >
                        <Pie
                            stroke='none'
                            data={data}
                            innerRadius={18}
                            outerRadius={35}
                            paddingAngle={2}
                            dataKey="value"
                            >
                            {data.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index]} />
                            ))}
                        </Pie>
                      </PieChart>
                    <Typography variant='h5'>{data[0].name}</Typography>
                    </Box>
                  ))        
                  }
                </FlexBetween>              
            </DashboardBox>
            <DashboardBox  gridArea="j">
                  <BoxHeader title='Overall Summary and Explanation Data' sideText='+15%'/>
                      <Box height="15px"
                           margin="1.25rem 1rem 0.4rem 1rem"
                           bgcolor={palette.primary[600]}
                           borderRadius="1rem"
                      >
                        <Box
                        height="15px"
                        bgcolor={palette.primary[800]}
                        borderRadius="1rem"
                        width="40%"
                        >
                        </Box>
                      </Box>

                      <Typography margin="0 1rem" p="0.1rem 0rem 0.1rem 0" variant='h6'>
                        This dynamic element provides a clear and immediate representation of our current progress in data analysis and summarization efforts. The teal fill of the progress bar against the dark background offers a stark visual representation of the advancement, and the "+15%" marker signifies an improvement or an increment over a baseline measurement.
                      </Typography>

              
            </DashboardBox>
      </>
    )
}

export default Row3
