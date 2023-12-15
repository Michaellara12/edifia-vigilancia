// next
import Router from 'next/router';
// @mui
import { Card, Container, Typography, Button, Box } from "@mui/material";
// components
import { useSettingsContext } from '../settings';
// paths
import { PATH_DASHBOARD } from 'src/routes/paths';
// icons
import LaunchIcon from '@mui/icons-material/Launch';

// ----------------------------------------------------------------------

export default function NoChatroomAssigned() {
    
    const { themeStretch } = useSettingsContext();
    
    const handleClick = () => {
        Router.push(PATH_DASHBOARD.chat.root)
    }

    return (
        <Container maxWidth={themeStretch ? false : 'xl'} sx={{overflow: 'hidden'}}>
            <Card sx={{ height: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Box sx={{ width: 320, height:320 }}>
                    <img src="/assets/illustrations/robot-messages.png" alt='robot with chatbubbles' />
                </Box>
                <Typography variant='h4' align='center' sx={{mx: 1, width: '80%'}}>Oops parece que no has vinculado ninguna cuenta</Typography>
                <Typography variant='body2' align='center' sx={{mx: 2}}>Recuerda que puedes agregar una cuenta de escaneando un código QR o agregando tu llaves de Api de WhatsApp</Typography>
                <Button variant='contained' sx={{mt: 1}} startIcon={<LaunchIcon />} onClick={handleClick}>Vincular cuenta</Button>
            </Card>
        </Container>
    )
}