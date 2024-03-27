import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';
import FlexBetween from '@/components/FlexBetween';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const Navbar = () => {
    const {palette } = useTheme();
    const [selected,setSelected]=useState("dashboard");

    return (
        <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
            {/* LEFT SIDE */}
            <FlexBetween gap="0.75rem"> 
                <LeaderboardIcon sx={{fontSize:"30px"}}/>
                <Typography variant='h4' fontSize="16px">
                    DataSight
                </Typography>
            </FlexBetween>
            {/* RIGHT SIDE */}
            <FlexBetween gap="2rem" >
                <Box>
                <Link to={"/"}
                onClick={()=>setSelected("dashboard")}
                style={{color:selected==="dashboard"?"inherit":palette.grey[700],
                textDecoration:"none"
            }}
                >
                    Dashboard
                </Link>
                </Box>
                <Link to={"/predictions"}
                onClick={()=>setSelected("predictions")}
                style={{color:selected==="predictions"?"inherit":palette.grey[700],
                textDecoration:"none"   
            }}
                >
                   Predictions
                </Link>
                <Box>
                    
                </Box>
            </FlexBetween>
        </FlexBetween>
    )
}

export default Navbar
