// next
import NextLink from 'next/link';
// @mui
import { Stack, Typography, Link } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
//
import AuthWithSocial from './AuthWithSocialRegister';
import AuthRegisterForm from './AuthRegisterForm';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <LoginLayout illustration="/assets/illustrations/girl3.png" subtitle="Usa inteligencia artificial para vender más o analizar la gestión comercial de tus vendedores">
      
      <Stack spacing={2} sx={{ mb: 2, position: 'relative' }}>
        <Typography variant="h4">¡Crea una cuenta, es completamente gratís!</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> ¿Tienes una cuenta creada? </Typography>

          <Link component={NextLink} href={PATH_AUTH.ingreso} variant="subtitle2">
            Ingresar
          </Link>
        </Stack>
      </Stack>

      <AuthWithSocial />

      <AuthRegisterForm />

      <Typography
        component="div"
        sx={{ color: 'text.secondary', mt: 3, typography: 'caption', textAlign: 'center' }}
      >
        {'Al registrarte, estas de acuerdo con nuestra '}
        <Link underline="always" color="text.primary" href='https://entey.net/terminos-y-condiciones-de-uso/' target='_blank'>
          Política de Privacidad
        </Link>
        {' & '}
        <Link underline="always" color="text.primary" href='https://entey.net/terminos-y-condiciones-de-uso/' target='_blank'>
          Términos y Condiciones.
        </Link>
      </Typography>

    </LoginLayout>
  );
}