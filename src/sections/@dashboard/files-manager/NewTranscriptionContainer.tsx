// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
// components
import Image from '../../../components/image/Image';
import UploadTranscriptionDialog from 'src/components/dialog/UploadTranscriptionDialog';
// utils
import { bgGradient } from 'src/utils/cssStyles';
// context
import { useFileUploaderContext } from 'src/contexts/FileUploaderContext';

// ----------------------------------------------------------------------

export default function NewTranscriptionContainer() {

  const theme = useTheme();

  const { 
    openUploadFile,
    handleOpenUploadFile,
    handleCloseUploadFile
  } = useFileUploaderContext()

  return (
    <Box sx={{ mt: {sm: -8, xs: 0} }}>
      <Image
        disabledEffect
        alt="illustration-invite"
        src='/assets/illustrations/microphone.png'
        sx={{
          left: 30,
          zIndex: 9,
          width: 110,
          position: 'relative',
          filter: 'drop-shadow(0 24px 16px rgba(0,0,0,0.24))',
        }}
      />

      <Box
        sx={{
          mt: -15,
          color: 'common.white',
          borderRadius: 2,
          p: theme.spacing(16, 2, 2, 2),
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.primary.main,
            endColor: theme.palette.primary.dark,
          }),
        }}
      >
        <Typography variant="h6" sx={{ whiteSpace: 'pre-line' }}>
            Transcribe tus reuniones con Inteligencia Artificial
        </Typography>

        <Typography variant="body2" sx={{ my: 1 }}>
            Sube la grabación de la reunión que deseas transcribir a texto y en unos minutos estará lista 😉
        </Typography>
                                                
        <Button 
            color="warning" 
            variant="contained"
            fullWidth
            sx={{ boxShadow: theme.customShadows.z16 }}
            onClick={handleOpenUploadFile}
        >
          Transcribir audio
        </Button>
      </Box>

      <UploadTranscriptionDialog 
        title='Transcribir archivos'
        open={openUploadFile} 
        onClose={handleCloseUploadFile} 
      />
    </Box>
  );
}