import Image from 'src/components/image/Image';
import Router from "next/router";
// @mui
import { Container, Stack, Typography, Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
//
import { PATH_DASHBOARD } from "src/routes/paths";

// -----------------------------------------------------

export default function NoProjectFound() {
    return (
      <Container>
        <Stack gap={1} alignItems='center'>
          <Image src='/assets/illustrations/document-not-found.png' alt='error' sx={{ width: 280, height: 280 }}/>
          <Typography variant='h4'>
            Oops parece que este documento no existe
          </Typography>
          <Typography variant='body2'>
            Probablemente fue eliminado o el enlace al que intentas acceder no funciona.
          </Typography>
          <Button 
            startIcon={<HomeIcon/>} 
            variant='contained'
            onClick={() => Router.push(PATH_DASHBOARD.redaccion)}
          >
            Regresar al Home
          </Button>
        </Stack>
      </Container>
    )
}