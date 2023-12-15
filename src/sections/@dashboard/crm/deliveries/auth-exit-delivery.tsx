import { useState } from 'react';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  Avatar,
  Typography,
  Divider
} from '@mui/material';
// @types
import { IDelivery } from 'src/@types/crm';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
//
import { useSnackbar } from "src/components/snackbar";
import { useAuthContext } from 'src/auth/useAuthContext';
import Iconify from 'src/components/iconify/Iconify';
import { ImageLightbox } from 'src/components/image';
// utils
import { parseUnitId } from 'src/utils/parse-unit-id';
import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  item: IDelivery;
}

// ----------------------------------------------------------------------

export default function AuthExitDelivery({
  open,
  onClose,
  item,
}: DialogProps) {

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();

  const {
    id,
    photoUrl,
    unitId
  } = item;

  async function authAction() {
    setLoading(true)
    try {
      const docRef = doc(DB, 'basic-crm', user?.uid, 'deliveries', id);

      await updateDoc(docRef, { exitDate: serverTimestamp() });

      enqueueSnackbar(`Se autorizó la salida del domiciliario`);
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    }
    setLoading(false)
    onClose();
  };

  return (
    <Dialog maxWidth="xs" open={open} onClose={onClose} fullWidth>
      <DialogTitle>Autorizar salida</DialogTitle>
      <DialogContent sx={{ typography: 'body2', mb: 3 }}> 
      <Stack gap={2}>

        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ width: '100%' }}>
          {/* Image lightbox */}
          <Stack sx={{ width: {sm: '50%', xs: '100%'}, mb: 2 }} alignItems={{ xs: 'center', sm: 'flex-start' }}>
            <Avatar src={photoUrl} variant='rounded' sx={{ width: 120, height: 120 }}/>
          </Stack>

          {/* Vehicle properties */}
          <Stack sx={{ width: '100%' }}>
            <Typography variant='subtitle1'>Datos residente que autorizó</Typography>

            <Divider sx={{ my: 1 }}/>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Unidad
              </Typography>
              <Typography variant="body2">{parseUnitId(unitId)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Nombre(s)
              </Typography>
              <Typography variant="body2">{item.authResident?.name}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Apellido(s)
              </Typography>
              <Typography variant="body2">{item.authResident?.lastName}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Tipo
              </Typography>
              <Typography variant="body2">{item.authResident?.type}</Typography>
            </Stack>


          </Stack>
        </Stack>
          <Typography>
            Autorizar salida del domiciliario de la copropiedad. 
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ width: '100%' }} gap={1}>
            <Button 
              fullWidth 
              variant="contained" 
              color="info"
              startIcon={<Iconify icon='iconamoon:exit'/>}
              onClick={() => authAction()}
              disabled={loading}
            >
              Autorizar salida
            </Button>
                
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancelar
            </Button>
          </Stack>
      </Stack>
      </DialogContent>
    </Dialog>
  );
}