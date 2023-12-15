import { useState } from 'react';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  Typography
} from '@mui/material';
// @types
import { IUnitVehicle } from 'src/@types/crm';
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
  item: IUnitVehicle;
}

// ----------------------------------------------------------------------

export default function AuthEntryExitVehicle({
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
    type,
    color,
    brand,
    licensePlate,
    token,
    unitId
  } = item;

  async function authAction(authActionType: string) {
    setLoading(true)
    try {
      const newDocId = uuidv4();
      const unitRef = doc(DB, 'basic-crm', user?.uid, 'units', unitId);
      // Check if the unitRef document exists
      const unitDoc = await getDoc(unitRef);
      if (!unitDoc.exists()) {
        throw new Error('Esta unidad no existe');
      }
  
      const docRef = doc(DB, 'basic-crm', user?.uid, 'units', unitId, 'vehicle-control', newDocId);
      const vehicleDocRef = doc(DB, 'basic-crm', user?.uid, 'vehicles', id)

      const payload = {
        id: newDocId,
        timestamp: serverTimestamp(),
        unitId: unitId,
        authAction: authActionType,
        vehicleId: id,
        vehicle: {
          brand: brand,
          type: type,
          color: color,
          licensePlate: licensePlate,
          photoUrl: photoUrl,
          token: token
        }
      }
      await setDoc(docRef, payload);

      // Update the lastActivity field of vehicleDocRef with the payload
      await updateDoc(vehicleDocRef, {
        lastActivity: payload
      });
  
      const actionMessage = authActionType === 'Ingreso' ? 'ingreso' : 'salida';
      enqueueSnackbar(`Se registró el ${actionMessage} del vehículo`);
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    }
    setLoading(false)
    onClose();
  };

  return (
    <Dialog maxWidth="xs" open={open} onClose={onClose} fullWidth>
      <DialogTitle>Autorizar ingreso o salida 🚗</DialogTitle>
      <DialogContent sx={{ typography: 'body2', mb: 3 }}> 
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ width: '100%' }}>
          {/* Image lightbox */}
          <Stack sx={{ width: '100%', mb: 2 }} alignItems={{ xs: 'center', sm: 'flex-start' }}>
            <ImageLightbox image={photoUrl} />
          </Stack>

          {/* Vehicle properties */}
          <Stack sx={{ width: '100%' }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Tipo de vehículo
              </Typography>
              <Typography variant="body2">{type}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Color
              </Typography>
              <Typography variant="body2">{color}</Typography>
            </Stack>

            {brand && <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Marca
              </Typography>
              <Typography variant="body2">{brand}</Typography>
            </Stack>}

            {licensePlate && <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Placa
              </Typography>
              <Typography variant="body2">{licensePlate}</Typography>
            </Stack>}

            {token && <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Ficha bicicletero
              </Typography>
              <Typography variant="body2">{token}</Typography>
            </Stack>}

            {unitId && <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">
                Unidad
              </Typography>
              <Typography variant="body2">{parseUnitId(unitId)}</Typography>
            </Stack>}
          </Stack>
        </Stack>
        {/* Buttons */}
        <Stack gap={1} sx={{ mt: {xs: 2, sm: 0} }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
            <Button 
              fullWidth 
              variant="contained" 
              color="success"
              startIcon={<Iconify icon='uil:entry'/>}
              onClick={() => authAction('Ingreso')}
              disabled={loading}
            >
              Autorizar ingreso
            </Button>

            <Button 
              fullWidth 
              variant="contained" 
              color="info"
              startIcon={<Iconify icon='iconamoon:exit'/>}
              onClick={() => authAction('Salida')}
              disabled={loading}
            >
              Autorizar salida
            </Button>
          </Stack>
          
          <Button 
            fullWidth 
            variant="outlined" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancelar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}