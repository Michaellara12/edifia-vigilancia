import Image from 'src/components/image/Image';
import Router from 'next/router';
import { Stack, Typography, LinearProgress, Button } from '@mui/material'
import Iconify from 'src/components/iconify/Iconify';
import { PATH_DASHBOARD } from 'src/routes/paths';

// -------------------------------------------------------

const GptRequestLoadingScreen = () => {
  return (
    <Stack gap={1} alignItems='center'>
      <Image 
        src='/assets/illustrations/construction.png' 
        alt='loading screen' 
        sx={{ width: 300, height: 300 }}
      />
      <LinearProgress sx={{ width: '30%' }}/>
      <Typography variant='h4' textAlign='center'>Redactando el documento...</Typography>
      <Typography variant='body2' textAlign='center'>
        Esto puede tomar varios minutos dependiendo de la complejidad de la solicitud
    </Typography>
      <Button 
        variant='contained'
        startIcon={<Iconify icon='ion:home-outline'/>}
        onClick={() => Router.push(PATH_DASHBOARD.redaccion)}
      >
        Regresar al home
      </Button>
    </Stack>
  );
}

export default GptRequestLoadingScreen;
