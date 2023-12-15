// icons
import GoogleIcon from '@mui/icons-material/Google';
// @mui
import { Divider, Button, useTheme } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function AuthWithSocial() {
  const { loginWithGoogle } = useAuthContext();
  const theme = useTheme()

  const handleGoogleLogin = async () => {
    try {
      if (loginWithGoogle) {
        loginWithGoogle();
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <Button 
        startIcon={<GoogleIcon />} 
        sx={{
          width: '100%', 
          py: 1.5, 
          boxShadow: theme.customShadows.z8,
          mb: 2 
        }} 
        variant='contained'
        onClick={handleGoogleLogin}
      >
            Ingresa con Google
      </Button>     
      <Divider
        sx={{
          my: 2.5,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, ::after': {
            borderTopStyle: 'dashed',
          },
        }}
      >
        o ingresa con tu email
      </Divider>
    </div>
  );
}