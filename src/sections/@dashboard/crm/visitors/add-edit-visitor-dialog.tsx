import Router from 'next/router';
// @mui
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Stack, 
  Typography,
  useTheme
} from '@mui/material';
//
import Image from 'src/components/image/Image';
import Iconify from 'src/components/iconify/Iconify';
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export default function AddEditVisitorDialog({
  open,
  onClose,
}: DialogProps) {
  const theme = useTheme()

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>Registrar visitante</DialogTitle>

      {/* Form */}
      <DialogContent sx={{ typography: 'body2', pb: 3}}> 
        <Stack gap={3}>
          <Stack height='100%' width='100%' direction='row'
            alignItems='center'
            justifyContent='space-around'
            gap={2}
            sx={{ 
              p: 2,
              borderRadius: 2,
              boxShadow: theme.customShadows.z12,
              border: (theme) => `solid 1px ${theme.palette.divider}`,
                '&:hover': {
                  borderColor: 'transparent',
                  bgcolor: 'background.paper',
                  cursor: 'pointer'
              }
          }}
            onClick={() => Router.push(PATH_DASHBOARD.registroIngresoPersonas.newPersonCedula)}
          >
              <Image
                disabledEffect
                alt="illustration-invite"
                src='/assets/illustrations/id-card.png'
                sx={{
                  width: 75
                }}
              />

              <Stack gap={1}>
                <Typography variant='subtitle1' 
                  sx={{ 
                    userSelect: 'none'  // block text from being selected
                  }}>
                  Registrar con cédula C.C.
                </Typography>  
              </Stack>
              <Iconify 
                icon='tabler:chevron-right'
                sx={{ width: 30, height: 30 }}
              />
            </Stack>

            <Stack height='100%' width='100%' direction='row'
              alignItems='center'
              justifyContent='space-around'
              gap={2}
              sx={{ 
                p: 2,
                borderRadius: 2,
                boxShadow: theme.customShadows.z12,
                border: (theme) => `solid 1px ${theme.palette.divider}`,
                '&:hover': {
                  borderColor: 'transparent',
                  bgcolor: 'background.paper',
                  cursor: 'pointer'
                },
              }}
              onClick={() => Router.push(PATH_DASHBOARD.registroIngresoPersonas.newPerson)}
            >
              <Image
                disabledEffect
                alt="illustration-invite"
                src='/assets/illustrations/file2-mini.png'
                sx={{
                  width: 75
                }}
              />

              <Stack gap={1}>
                <Typography variant='subtitle1'
                sx={{ 
                  userSelect: 'none'  // block text from being selected
                  }}
                >
                  Registrar con formulario
                </Typography>  
              </Stack>
              <Iconify 
                icon='tabler:chevron-right'
                sx={{ width: 30, height: 30 }}
              />
            </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}