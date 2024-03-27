import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox'
import FlexBetween from '@/components/FlexBetween';
import { useGetKpisQuery, useGetProductsQuery } from '@/state/api'
import { Box, Slider, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react'
import { CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, Scatter,ScatterChart, ZAxis } from 'recharts';
import * as ss from 'simple-statistics'
import { OperationalExpensesStatus, nonOperationalExpensesStatus,monthlyDataItem, Financials } from '@/state/types';
import "ag-charts-enterprise";
import { AgChartOptions } from "ag-charts-enterprise";
import { AgChartsReact } from "ag-charts-react";




const ChartBoxPlot = ({
    operationalStats,
    nonOperationalStats,
    palette
}) => {
    const [options] = useState<AgChartOptions>({
    autoSize:true,
    background:{
        fill:palette.background.default
    },
      data: [{
        expenses: "Operational expenses",
        min: operationalStats.operationalMin,
        q1: operationalStats.operationalQ1,
        median: operationalStats.operationalMedian,
        q3: operationalStats.operationalQ3,
        max: operationalStats.operationalMax,
      },
      {
        expenses: "Non Operational expenses",
        min: nonOperationalStats.nonOperationalMin,
        q1: nonOperationalStats.nonOperationalQ1,
        median: nonOperationalStats.nonOperationalMedian,
        q3: nonOperationalStats.nonOperationalQ3,
        max: nonOperationalStats.nonOperationalMax,
      },
      ],
      axes:[
        {
            type:'category',
            position:'bottom',
            label:{
                color:"#6b6d74"
            }
        },
        {
            type:"number",
            position:"left",
            label:{
                color:"#6b6d74"
            }
        }

      ],
      series: [
        {
          type: "box-plot",
          yName: "Box plot values",
          xKey: "expenses",
          minKey: "min",
          q1Key: "q1",
          medianKey: "median",
          q3Key: "q3",
          maxKey: "max",
          stroke: "#098a89",
          fill: palette.primary[500],
          strokeWidth: 2,
          whisker: {
            stroke: palette.primary[700],
           
          },
          cap:{
            lengthRatio:0.8
        }
        },
      ],

    });
  
    return (
            <div style={{margin:"20px 0px 0px -10px" }}> 
                <AgChartsReact options={options} />
            </div>
    )
  };



const Row2 = () => {

    const {data:operationalData} = useGetKpisQuery();
    const {data:productData} = useGetProductsQuery();
    const {palette}=useTheme();
    const pieColor=[palette.primary[800], palette.primary[300]]
    const [operationalStats,setOperationalStats] = useState<OperationalExpensesStatus | null> (null)
    const [nonOperationalStats, setNonOperationalStats]=useState<nonOperationalExpensesStatus | null> (null)
    const [targetSales,setTargetSales]=useState(83)
    const [profitMargin,setProfitMargin] = useState(0)
    const [lossesPercentage,setLossesPercentage] = useState(0)
    const isAboveMediumScreens = useMediaQuery("(min-width:1200px)")


 



    const statsRevenueExpenses:monthlyDataItem[] = useMemo(()=>{
        
        if (!operationalData||operationalData.length===0 || !operationalData[0].monthlyData){
            return []
        }

        return operationalData[0].monthlyData.map(({month,operationalExpenses,nonOperationalExpenses,revenue,expenses})=>({
            "month":month.substring(0,3),
            "revenue": revenue,
            "expenses":expenses,
            "operationalExpenses":operationalExpenses,
            "nonOperationalExpenses":nonOperationalExpenses,
        }))

    },[operationalData])

    const calculateRevenueAndExpenses = (operationalStats:monthlyDataItem[]) =>{

        let revenueTotalMonth = 0;
        let expensesTotalMonth = 0;

        operationalStats.forEach((data)=>{
            revenueTotalMonth += data.revenue;
            expensesTotalMonth += data.expenses;
        })
        
        const averageRevenue = revenueTotalMonth / operationalStats.length
        const averageExpenses = expensesTotalMonth/ operationalStats.length

        return {
            averageRevenue,
            averageExpenses
        }
    }
    const {averageRevenue, averageExpenses} = calculateRevenueAndExpenses(statsRevenueExpenses)

    const calculateOperationalExpensesStats = (operationalExpensesArray)=>{
        const operationalMin = ss.min(operationalExpensesArray);
        const operationalQ1 = ss.quantile(operationalExpensesArray, 0.25);
        const operationalMedian = ss.median(operationalExpensesArray);
        const operationalQ3 = ss.quantile(operationalExpensesArray, 0.75);
        const operationalMax = ss.max(operationalExpensesArray);

        return {operationalMin,
                operationalQ1,
                operationalMedian,
                operationalQ3,
                operationalMax,
        }
    }

    const calculateNonOperationalExpensesStats = (nonOperationalExpensesArray)=>{
        const nonOperationalMin = ss.min(nonOperationalExpensesArray);
        const nonOperationalQ1 = ss.quantile(nonOperationalExpensesArray, 0.25);
        const nonOperationalMedian = ss.median(nonOperationalExpensesArray);
        const nonOperationalQ3 = ss.quantile(nonOperationalExpensesArray, 0.75);
        const nonOperationalMax = ss.max(nonOperationalExpensesArray);

        return {nonOperationalMin,
                nonOperationalQ1,
                nonOperationalMedian,
                nonOperationalQ3,
                nonOperationalMax,
        }
    }


    const lossesAndProfit = (targetSales:number,avgRevenue:number,avgExpenses:number):Financials=> {

        const profit = avgRevenue - avgExpenses
        const profitMarginValue = (profit / averageRevenue *100)
        
        const baseValue = averageRevenue/90
        const realTargetSales=baseValue*targetSales
        
        let superavitOrDeficit

        if (averageRevenue<realTargetSales){
            superavitOrDeficit = ((realTargetSales - averageRevenue) / realTargetSales) * -100;
        }
        else {

            superavitOrDeficit = ((averageRevenue - realTargetSales) / realTargetSales) * 100; 

        }

        return {
            profitMarginValue,
            superavitOrDeficit
        }
    }
   

    useEffect(()=>{
        const operationalExpensesArray:number[]=statsRevenueExpenses.map((expenses)=>expenses['operationalExpenses'])
        const nonOperationalExpensesArray:number[] = statsRevenueExpenses.map((expenses)=>expenses["nonOperationalExpenses"])
        

        if (operationalExpensesArray.length > 0 && nonOperationalExpensesArray.length > 0){
            setOperationalStats(calculateOperationalExpensesStats(operationalExpensesArray))
            setNonOperationalStats(calculateNonOperationalExpensesStats(nonOperationalExpensesArray))

        }
       // eslint-disable-next-line
    }, [operationalData])


    useEffect(()=>{

        const financials = lossesAndProfit(targetSales,averageRevenue,averageExpenses)
        setProfitMargin(financials.profitMarginValue)
        setLossesPercentage(financials.superavitOrDeficit)
       
        // eslint-disable-next-line
    },[operationalData,targetSales])

    
    const handleSliderChange = (event, newValue) => {
        setTargetSales(newValue)
    }
    

    const productExpenseData= useMemo(()=>{
        return(
            productData &&
            productData.map(({_id,price,expense})=>{
                return{
                    id:_id,
                    price: price,
                    expenses:expense ,
                }
            })
        )
    },[productData])

    const pieData=[
        {
            name:"Group A", value:lossesPercentage
        },
        {
            name:"Group B", value:profitMargin
        }
    ]



    return (
        <>
            <DashboardBox bgcolor="#fff" gridArea="d"> 
            <BoxHeader title='Operational vs Non Operational expenses' sideText='+4%'/>
                    <Box
                    >
                    {
                        (nonOperationalStats  && operationalStats) ? 
                     (
                        <ChartBoxPlot
                            operationalStats={operationalStats}
                            nonOperationalStats={nonOperationalStats}
                            palette={palette}
                            
                        />
                     )
            
                        : ( null)
                    }
                    </Box>
            </DashboardBox>
            <DashboardBox bgcolor="#fff" gridArea="e">
            <BoxHeader title='Campaigns and Targets' sideText='+4%' />
            <FlexBetween mt={isAboveMediumScreens? "1rem":"1.5rem" } gap="1.5" pr={isAboveMediumScreens? "1rem":"" } ml={isAboveMediumScreens? "2rem":"4rem" }>
                <PieChart 
                    width={100} height={110}
                    margin={{
                        top: 0,
                        right:-15,
                        left:10,
                        bottom: -10,
                    }}
                    >
                    <Pie
                        stroke='none'
                        data={pieData}
                        innerRadius={18}
                        outerRadius={38}
                        paddingAngle={2}
                        dataKey="value"
                        >
                        {pieData.map((_,index) => (

                            <Cell key={`cell-${index}`} fill={pieColor[index]} />
                        
                        ))}
                    </Pie>
                </PieChart>
                <Box ml="1rem" flexBasis="30%" textAlign="center">
                    <Typography variant='h5'
                    id="target-sales-slider"
                    > Target Sales</Typography>
                    <Typography m="0.3rem 0" variant='h3' color={palette.primary[300]}>
                        <Slider
                        onChange={handleSliderChange}
                        value={ typeof targetSales ==="number" ? targetSales:50}
                        aria-labelledby='target-sales-slider'
                        max={90}
                        min = {50}
                        />
                        {targetSales}
                    </Typography>
                    <Typography variant='h6'>
                        Finance Goals of the Campaign that is desired
                    </Typography>
                </Box>

                <Box  flexBasis="30%" >
                    <Typography variant='h5'> Losses in Revenue</Typography>
                    <Typography variant='h6'>
                        Losses are down {lossesPercentage.toFixed(2)}% 
                    </Typography>
                    <Typography mt="0.7rem" variant='h5'>
                        Profit Margins
                    </Typography>
                    <Typography variant='h6'>
                        Margins are up by {profitMargin.toFixed(2)}% from last month
                    </Typography>
                </Box>
            </FlexBetween>
            </DashboardBox>  
            <DashboardBox bgcolor="#fff" gridArea="f">   
                <BoxHeader title='Product Prices vs Expenses' sideText='+4%' />
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 25,
                            bottom: 40,
                            left: -10,
                        }}
                        >

                        <CartesianGrid stroke={palette.grey[800]}/>
                        <XAxis 
                            type="number" 
                            dataKey="price" 
                            name="price" 
                            axisLine={false}
                            tickLine={false}
                            style={{fontSize:"10px"}}
                            tickFormatter={(v)=>`$${v}`}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="expenses" 
                            name="expenses" 
                            axisLine={false}
                            tickLine={false}
                            style={{fontSize:"10px"}}
                            tickFormatter={(v)=>`$${v}`}
                        />
                    <ZAxis type='number' range={[20]}/>
                    <Tooltip formatter={(v)=>`$${v}`} />
                    <Scatter name="Product Expense Ratio" data={productExpenseData} fill={palette.tertiary[500]} />
                    </ScatterChart>
                </ResponsiveContainer>       
            </DashboardBox>
        </>
    )
}

export default Row2
