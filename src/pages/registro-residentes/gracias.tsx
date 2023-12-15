import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Container, Button, Typography, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function RegistroResidentesGracias() {
  return (
    <>
      <Head>
        <title>Gracias | Edifia</title>
      </Head>

      <Container sx={{ mt: 5 }}>
        <Stack alignItems='center' gap={1}>
          <img src="/assets/illustrations/residential-complex.png"/>

          <Typography variant="h3">
            ¡Gracias por registrarte!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Ahora vas a poder autorizar visitantes, recibir notificaciones de paquetes, correspondencia, comunicados, ingreso y salida de vehículos ¡y mucho más!
          </Typography>

          <Button href="https://edifiad.com/" size="large" variant="contained">
            Más información
          </Button>

        </Stack>
      </Container>
    </>
  );
}
