import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox'
import FlexBetween from '@/components/FlexBetween';
import { useGetKpisQuery, useGetProductsQuery } from '@/state/api'
import { Box, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react'
import { CartesianGrid, Tooltip, Line, LineChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, Scatter,ScatterChart, ZAxis } from 'recharts';



const pieData=[
    {
        name:"Group A", value:800
    },
    {
        name:"Group B", value:400
    }
]

const Row2 = () => {

    const {data:operationalData} = useGetKpisQuery();
    const {data:productData} = useGetProductsQuery();
    const {palette}=useTheme();
    const pieColor=[palette.primary[800], palette.primary[300]]

    console.log("Products",productData)

    const operationalExpenses = useMemo(()=>{
        return(
            operationalData &&
            operationalData[0].monthlyData.map(({month,operationalExpenses,nonOperationalExpenses})=>{
                return{
                    name:month.substring(0,3),
                    "Operational Expenses": operationalExpenses,
                    "Non OperationalExpenses":nonOperationalExpenses,
                }
            })
        )
    },[operationalData])


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


    return (
        <>
            <DashboardBox bgcolor="#fff" gridArea="d"> 

            <BoxHeader title='Operational vs Non Operational expenses' sideText='+4%'/>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                    data={operationalExpenses}
                    margin={{
                        top: 20,
                        right: 0,
                        left: -10,
                        bottom: 55,
                    }}
                        >
                        <CartesianGrid vertical={false} stroke={palette.grey[800]}/>
                        
                        <XAxis dataKey="name"  tickLine={false} style={{fontSize:"10px"}}/>
                        <YAxis yAxisId="left" orientation='left' axisLine={false} tickLine={false} style={{fontSize:"10px"}}  />
                        <YAxis yAxisId="right" orientation='right' axisLine={false} tickLine={false} style={{fontSize:"10px"}}  />
                        <Tooltip/>
                        <Line yAxisId="left" type="monotone" dataKey="Non OperationalExpenses" stroke={palette.tertiary[500]} />
                        <Line yAxisId="right" type="monotone" dataKey="Operational Expenses" stroke={palette.primary.main} />

                    </LineChart>
                </ResponsiveContainer>
            
            </DashboardBox>
            <DashboardBox bgcolor="#fff" gridArea="e">
            <BoxHeader title='Campaigns and Targets' sideText='+4%' />
            <FlexBetween mt="0.25 rem" gap="1.5" pr="1rem">
                <PieChart 
                    width={100} height={110}
                    margin={{
                        top: 0,
                        right:-10,
                        left:10,
                        bottom: 0,
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
                <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
                    <Typography variant='h5'> Target Sales</Typography>
                    <Typography m="0.3rem 0" variant='h3' color={palette.primary[300]}>
                        83
                    </Typography>
                    <Typography variant='h6'>
                        Finance Goals of the Campaign that is desired
                    </Typography>
                </Box>

                <Box  flexBasis="40%" >
                    <Typography variant='h5'> Losses in Revenue</Typography>
                    <Typography variant='h6'>
                        Losses are down 25%
                    </Typography>
                    <Typography mt="0.7rem" variant='h5'>
                        Profit Margins
                    </Typography>
                    <Typography variant='h6'>
                        Margins are up by 30% from last month
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
