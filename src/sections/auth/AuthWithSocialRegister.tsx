// @mui
import { Divider, Button } from '@mui/material';
// icons
import GoogleIcon from '@mui/icons-material/Google';
// auth
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function AuthWithSocial() {
  const { loginWithGoogle, loginWithTwitter } = useAuthContext();

  const handleGoogleLogin = async () => {
    try {
      if (loginWithGoogle) {
        loginWithGoogle();
      }
      console.log('GOOGLE LOGIN');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button 
        startIcon={<GoogleIcon />} 
        sx={{width: '100%', py: 1.5}} 
        variant='contained'
        onClick={handleGoogleLogin}
      >
            Regístrate con Google
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
        o crea una cuenta con tu email
      </Divider>
    </div>
  );
}