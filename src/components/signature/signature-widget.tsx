import { useState } from 'react';
// @mui
import { Typography } from '@mui/material';
//
import SignaturePreview from './signature-preview';
import SignatureDialog from './signature-dialog';
// components
import Iconify from '../iconify';
import { StyledPictureContainer, StyledPlaceholder } from './styles';
// types
import { SignatureWidgetProps } from './types';

// ----------------------------------------------------------------------

export default function SignatureWidget({ signature, setSignature }: SignatureWidgetProps) {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const hasSignature = !!signature

  return (
    <>
      <SignatureDialog 
        open={open} 
        handleClose={handleClose} 
        setSignature={setSignature}
      />
      <StyledPictureContainer onClick={handleClickOpen} >
        {hasSignature && <SignaturePreview signature={signature} />}

        {!hasSignature && 
          <StyledPlaceholder
            sx={{
              '&:hover': {
                opacity: 0.72,
              },
            }}
          >
            <Iconify icon="ph:signature" width={28} sx={{ mb: 1 }} />
            <Typography variant="body2">Agregar firma</Typography>
          </StyledPlaceholder>
        }
      </StyledPictureContainer>

      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
        * Esta firma se utilizará únicamente y exclusivamente para resolución de
        PQRS (Peticiones, Quejas, Reclamos o Solicitudes)
      </Typography>
    </>
  );
}
