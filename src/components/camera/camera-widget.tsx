import { useState } from 'react';
// @mui
import { Typography } from '@mui/material';
//
import Iconify from '../iconify';
//
import { CameraProps } from './types';
import CameraPhotoPreview from './camera-photo-preview';
import CameraDialog from './camera-dialog';
import { StyledPictureContainer, StyledPlaceholder } from './styles';

// ----------------------------------------------------------------------

export default function CameraWidget({
  disabled,
  sx,
  file,
  setFile,
  isIdPicture
}: CameraProps) {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CameraDialog open={open} handleClose={handleClose} setFile={setFile} isIdPicture={isIdPicture}/>
      
      <StyledPictureContainer
        sx={{
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...sx,
        }}
        onClick={handleClickOpen}
      >
        {!!file && <CameraPhotoPreview file={file} />}

        <StyledPlaceholder
          className="placeholder"
          sx={{
            '&:hover': {
              opacity: 0.72,
            },
          }}
        >
          <Iconify icon="ic:round-add-a-photo" width={24} sx={{ mb: 1 }} />

          <Typography variant="caption">{file ? 'Cambiar foto' : 'Tomar foto'}</Typography>
        </StyledPlaceholder>
      </StyledPictureContainer>

      <Typography
        variant="caption"
        sx={{
          mt: 2,
          mx: 'auto',
          display: 'block',
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        *Recuerda habilitar el acceso
        <br /> a la cámara del dispositivo
      </Typography>
    </>
  );
}
