// @mui
import { Stack, Button, Typography, Box } from '@mui/material';
// icon
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// locales
import { useLocales } from '../../../locales';

// ----------------------------------------------------------------------

export default function NavDocs() {

  const { translate } = useLocales();

  return (
    <Stack
      spacing={3}
      sx={{
        px: 3,
        pb: 5,
        mt: 2,
        width: 1,
        display: 'block',
        textAlign: 'center',
      }}
    >

      <div>
        <Typography gutterBottom variant="subtitle1">
          {`${translate('¿Tienes problemas o deseas reportar algún error?')}`}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {`${translate('Chatea con uno de nuestros desarrolladores')}`}
        </Typography>
      </div>

      <Box component="img" src="/assets/illustrations/developer.png" />

      <Button startIcon={<WhatsAppIcon />} variant="contained" sx={{width: '100%', py: 1 }} href='https://wa.link/u20j9g' target='_blank'>{`${translate('Escríbenos')}`}</Button>
    </Stack>
  );
}
