import { Box, useMediaQuery } from '@mui/material'
import Row1 from './Row1'
import Row2 from './Row2'
import Row3 from './Row3'


const gridTemplateLargeScreen=`
    "a b c"
    "a b c"
    "a b c"
    "a b c"
    "d e f"
    "d e f"
    "d h f"
    "d h i"
    "g h i"
    "g h i"
`
const gridTemplateSmallScreens=
    `
    "a"
    "a"
    "a"
    "a"
    "b"
    "b"
    "b"
    "b"
    "c"
    "c"
    "c"
    "d"
    "d"
    "d"
    "d"
    "d"
    "d"
    "e"
    "e"
    "e"
    "f"
    "f"
    "f"
    "g"
    "g"
    "g"
    "h"
    "h"
    "h"
    "h" 
    "h"
    "i"
    "i"
    "i"
    `

const Dashboard = () => {
    const isAboveMediumScreens=useMediaQuery("(min-width:1200px)")

    return (
        <Box width="100%" height="100%" display="grid" gap="2rem"
        sx={isAboveMediumScreens? {
            
            gridTemplateColumns:"repeat(3, minmax(400px, 2fr))",
            gridTemplateRows:"repeat(12,minmax(80px,1fr))",
            gridTemplateAreas:gridTemplateLargeScreen,
        }
        
        :
        {
            gridAutoColumns:"1fr",
            gridAutoRows:"50px",
            gridTemplateAreas:gridTemplateSmallScreens,
        }
    
    }
        >
            <Row1 ></Row1>
            <Row2></Row2>
            <Row3></Row3>
        </Box>
    )
}

export default Dashboard
