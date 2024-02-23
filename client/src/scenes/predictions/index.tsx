import { useGetKpisQuery } from '@/state/api'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import DashboardBox from '@/components/DashboardBox'
import FlexBetween from '@/components/FlexBetween'
import { CartesianGrid, Tooltip, LineChart, ResponsiveContainer, XAxis, YAxis, Legend, Line, Label } from 'recharts'
import regression, {DataPoint} from "regression"




const Predictions = () => {
    const {palette}=useTheme()
    const[isPredictions,setIsPredictions]=useState(false)
    const {data:kpiData}=useGetKpisQuery()



    const formattedData=useMemo(()=>{
        if (!kpiData) return[];

        const monthData=kpiData[0].monthlyData;

        const formatted: Array<DataPoint> = monthData.map(({revenue},i:number)=>{
            return [i,revenue]
        })

        const regressionLine=regression.linear(formatted)
        
        console.log(regressionLine)
        return monthData.map(({revenue,month},i:number)=>{
            return{
                name:month,
                "Actual Revenue":revenue,
                "Regression Line":regressionLine.points[i][1],
                "Predictived Revenue":regressionLine.predict(i+12)[1]
            }
        })
    },[kpiData])


    return (
        <DashboardBox height="100%" width="100%" p="1rem" overflow="hidden">
            <FlexBetween m="1rem 2.5rem" gap="0.3rem">
                <Box>
                    <Typography variant='h3'>
                        Revenue and Predictions
                    </Typography>
                    <Typography variant='h6'>
                        Charted Revenue and predicted revenue based on simple linear regression model
                    </Typography>
                </Box>
                <Button 
                onClick={()=>setIsPredictions(!isPredictions)}
                sx={{color:palette.grey[900],
                    bgcolor:palette.grey[700],
                    boxShadow:"0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)"
                }}
                >
                    Show Predicted Revenue for Next Year
                </Button>
            </FlexBetween>
            <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                    data={formattedData}
                    margin={{
                        top: 20,
                        right: 0,
                        left: -10,
                        bottom: 55,
                    }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]}/>
                        
                        <XAxis dataKey="name"  tickLine={false} style={{fontSize:"10px"}}>
                            <Label value="Month" offset={-5} position="insideBottom"/>
                        </XAxis>
                        <YAxis 
                            domain={[12000,26000]}
                            axisLine={{strokeWidth:"0"}} 
                            tickFormatter={(v)=>`$${v}`}
                            tickLine={false} style={{fontSize:"10px"}}  >
                            <Label value="Revenue in USD" angle={-90} offset={-5} position="insideLeft"/>
                        </YAxis>
                        <Tooltip/>
                        <Legend verticalAlign='top'/>
                        <Line 
                            type="monotone" dataKey="Actual Revenue" stroke={palette.primary.main} 
                            strokeWidth={0}
                            dot={{strokeWidth:5}}
                        />
                        <Line  
                        type="monotone"
                        dot={false}
                        dataKey="Regression Line"                 
                        stroke={palette.tertiary.main} />
                        {
                            isPredictions &&
                        (
                            <Line  
                            strokeDasharray="5 5"
                            dot={false}
                            dataKey="Predictived Revenue"                 
                            stroke={palette.secondary[500]} />
                        )
                        }
                    </LineChart>
                </ResponsiveContainer>

        </DashboardBox>
    )
}

export default Predictions
