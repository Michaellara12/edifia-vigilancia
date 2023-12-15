// @mui
import { Stack, Typography, Link } from '@mui/material';
//
// import NextLink from 'next/link';
// layouts
import LoginLayout from '../../layouts/login';
// routes
// import { PATH_AUTH } from '../../routes/paths';
//
import AuthLoginForm from './AuthLoginForm';
import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login() {

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 2, position: 'relative' }}>
        <Typography variant="h4">Iniciar sesión</Typography>
        {/* <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">¿Aún no tienes una cuenta?</Typography>
          <Link component={NextLink} href={PATH_AUTH.registro} variant="subtitle2">Regístrate</Link>
        </Stack> */}
      </Stack>

      <AuthWithSocial />

      <AuthLoginForm />

    </LoginLayout>
  );
}
