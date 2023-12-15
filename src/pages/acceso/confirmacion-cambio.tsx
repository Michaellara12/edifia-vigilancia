// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Link, Typography } from '@mui/material';
// layouts
import CompactLayout from '../../layouts/compact';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
// assets
import { SentIcon } from '../../assets/icons';

// ----------------------------------------------------------------------

NewPasswordPage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  return (
    <>
      <Head>
        <title> Confirmación cambio de contraseña | Noman AI</title>
      </Head>

      <SentIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Revisa tu bandeja de entrada
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Hemos enviado un correo con los pasos que debes seguir para cambiar tu contraseña.
        <br/>
        <br/>
        Asegurate de revisar tu carpeta de SPAM.
      </Typography>

      <Link
        component={NextLink}
        href={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Regresar a la página de ingreso
      </Link>
    </>
  );
}
