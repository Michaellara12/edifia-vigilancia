import { m } from 'framer-motion';
// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Button, Typography, Stack } from '@mui/material';
// layouts
import CompactLayout from '../layouts/compact';
// components
import { MotionContainer, varBounce } from '../components/animate';

// ----------------------------------------------------------------------

Page404.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Head>
        <title> 404 Página No Encontrada | Edifia</title>
      </Head>

      <MotionContainer>
        <Stack alignItems='center'>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            ¡Página no encontrada!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
          Perdona, pero la página que estás buscando no existe, ¿quizá cometiste un error al ingresar la URL?
          Por favor revisa bien que las palabras estén bien escritas
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <img src="/assets/illustrations/error.png"/>
        </m.div>

        <Button component={NextLink} href="/" size="large" variant="contained">
          Regresar al Home
        </Button>

        </Stack>
      </MotionContainer>
    </>
  );
}
