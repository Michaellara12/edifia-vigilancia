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

Page500.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <>
      <Head>
        <title> 500 Error Interno del Servidor | Noman AI</title>
      </Head>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            500 Error Interno del Servidor
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Ocurrió un error, por favor intentalo de nuevo.
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
