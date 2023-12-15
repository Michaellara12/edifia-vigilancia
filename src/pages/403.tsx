import { m } from 'framer-motion';
// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Button, Typography } from '@mui/material';
// layouts
import CompactLayout from '../layouts/compact';
// components
import { MotionContainer, varBounce } from '../components/animate';


// ----------------------------------------------------------------------

Page403.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function Page403() {
  return (
    <>
      <Head>
        <title>403 Acceso Denegado | Edifia</title>
      </Head>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            No tienes permiso
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Esta página tiene un acceso restringido
            <br />
            Por favor hablar con el administrador del sistema
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <img src="/assets/illustrations/error.png" />
        </m.div>

        <Button component={NextLink} href="/" size="large" variant="contained">
          Regresar al Home
        </Button>
      </MotionContainer>
    </>
  );
}
