import { useCallback } from 'react';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  MenuItem,
  Typography
} from '@mui/material';
// form
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFSelect, RHFUploadAvatar } from 'src/components/hook-form';
// firebase
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { DB, STORAGE } from 'src/auth/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
//
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from "src/components/snackbar";
import { useAuthContext } from 'src/auth/useAuthContext';
// @types
import { IUnitVehicle } from 'src/@types/crm';
// utils
import { parseUnitIdValues } from 'src/utils/parse-unit-id';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  item?: IUnitVehicle;
  unitId?: string;
}

type FormValuesType = {
  photoUrl: string
  brand: string
  color: string
  licensePlate?: string
  type: string
  token?: string
  tower?: string
  unit: string
};

// ----------------------------------------------------------------------

export default function AddEditVehicleDialog({
  open,
  onClose,
  item,
  unitId,
  ...other
}: DialogProps) {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const carPhotoUrl = '/assets/illustrations/car.png';
  const motorbikePhotoUrl = '/assets/illustrations/motorbike.png';
  const bikePhotoUrl = '/assets/illustrations/bike.png';
  let unitValues = { tower: '', unit: '' }
  if (item) {
    unitValues = parseUnitIdValues(item?.unitId)
  }
  // In case the vehicle is created from units drawer
  if (unitId) {
    unitValues = parseUnitIdValues(unitId)
  }

  // Yup schema
  const RegisterSchema = Yup.object().shape({
    photoUrl: Yup.string(),
    type: Yup.string(),
    color: Yup.string().required('Este campo es obligatorio'),
    brand: Yup.string(),
    licensePlate: Yup.string(),
    token: Yup.string(),
    tower: Yup.string(),
    unit: Yup.string().required('Este campo es obligatorio')
  });

  const defaultValues = {
    photoUrl: item?.photoUrl,
    type: item?.type ? item?.type : 'Carro',
    brand: item?.brand,
    licensePlate: item?.licensePlate,
    color: item?.color,
    token: item?.token,
    tower: unitValues.tower,
    unit: unitValues.unit
  }

  const resetValues = {
    photoUrl: '',
    type: 'Carro',
    brand: '',
    licensePlate: '',
    color: '',
    token: '',
    tower: unitValues.tower,
    unit: unitValues.unit
  }

  const methods = useForm<FormValuesType>({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset(resetValues)
    onClose()
  }

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('photoUrl', newFile.preview, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onCreate = async (data: FormValuesType) => {
    const newDocId = uuidv4()
    const vehicleActionId = uuidv4()
    try {
      const unitRef = doc(DB, 'basic-crm', user?.uid, 'units', `${data.tower}${data.unit}`)
      const unitDoc = await getDoc(unitRef);
      if (!unitDoc.exists()) {
        throw new Error('Esta unidad no existe, si la torre usa letras prueba agregandola en minuscula o mayuscula');
      }
      // assign vehicle photo
      const docRef = doc(DB, 'basic-crm', user?.uid, 'vehicles', newDocId)
      let photoUrl = ''
      const fallbackPhotoUrl = data.type === 'Carro' ? carPhotoUrl : data.type === 'Moto' ? motorbikePhotoUrl : bikePhotoUrl;
      if (data.photoUrl && typeof data.photoUrl === 'string') {
        const storageRef = ref(STORAGE, `${user?.uid}/vehicles/${newDocId}`); // Fixed storageRef path
        // convert base64 string to blob
        const base64Response = await fetch(data.photoUrl)
        const blob = await base64Response.blob();
        // Upload the blob to storage
        const storageSnapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageSnapshot.ref);
        photoUrl = downloadUrl
      } else {
        photoUrl = fallbackPhotoUrl
      }
      
      const brand = data.brand ? data.brand : ''
      const licensePlate = data.licensePlate ? data.licensePlate : ''
      const color = data.color ? data.color : ''
      const token = data.token ? data.token : ''

      const lastActivityPayload = { 
        timestamp: serverTimestamp(), 
        id: vehicleActionId,
        unitId: `${data.tower}${data.unit}`,
        authAction: 'Registro',
        vehicleId: newDocId,
        // vehicle: {
        //   brand: brand,
        //   type: data.type,
        //   color: color,
        //   licensePlate: licensePlate,
        //   photoUrl: photoUrl,
        //   token: token
        // }
      }
      
      // Create a new vehicle object
      const newItem = {
        id: newDocId,
        photoUrl: photoUrl,
        type: data.type,
        brand: brand,
        licensePlate: licensePlate,
        color: data.color,
        token: token,
        unitId: `${data.tower}${data.unit}`,
        lastActivity: lastActivityPayload
      };
      await setDoc(docRef, newItem);

      // Register vehicle action log in vehicle-control db
      const vehicleRef = doc(DB, 'basic-crm', user?.uid, 'units', `${data.tower}${data.unit}`, 'vehicle-control', vehicleActionId)
      await setDoc(vehicleRef, lastActivityPayload)
      enqueueSnackbar('Nuevo vehículo  agregado')
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: 'error' })
    }
    handleClose()
  };

  const onEdit = async (data: FormValuesType) => {
    if (item) {
      try {
        const unitRef = doc(DB, 'basic-crm', user?.uid, 'units', `${data.tower}${data.unit}`)
        const unitDoc = await getDoc(unitRef);
        if (!unitDoc.exists()) {
          throw new Error('Esta unidad no existe, si la torre usa letras prueba agregandola en minuscula o mayuscula');
        }
        // assign vehicle photo
        const docRef = doc(DB, 'basic-crm', user?.uid, 'vehicles', item.id)
        let photoUrl = ''
        const fallbackPhotoUrl = data.type === 'Carro' ? carPhotoUrl : data.type === 'Moto' ? motorbikePhotoUrl : bikePhotoUrl;
        
        if (data.photoUrl && typeof data.photoUrl === 'string') {
          const storageRef = ref(STORAGE, `${user?.uid}/vehicles/${item.id}`); // Fixed storageRef path
          // convert base64 string to blob
          const base64Response = await fetch(data.photoUrl)
          const blob = await base64Response.blob();
          // Upload the blob to storage
          const storageSnapshot = await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageSnapshot.ref);
          photoUrl = downloadUrl
        } else {
          photoUrl = item ? item.photoUrl : fallbackPhotoUrl
        }
        
        const brand = data.brand ? data.brand : ''
        const licensePlate = data.licensePlate ? data.licensePlate : ''
        const color = data.color ? data.color : ''
        const token = data.token ? data.token : ''
        
        // Create a new vehicle object
        const newItem = {
          photoUrl: photoUrl,
          type: data.type,
          brand: brand,
          licensePlate: licensePlate,
          color: color,
          token: token,
          unitId: `${data.tower}${data.unit}`
        };
        await updateDoc(docRef, newItem);
        
        enqueueSnackbar('Información del vehículo actualizada')
      } catch (error) {
        enqueueSnackbar(`${error}`, { variant: 'error' })
      }
    }
    handleClose()
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose} {...other}>
      <DialogTitle>{item ? 'Editar vehículo ' : 'Agregar vehículo'}</DialogTitle>
      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 2 }}> 
        <FormProvider methods={methods} onSubmit={item ? handleSubmit(onEdit) : handleSubmit(onCreate)}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
              <RHFUploadAvatar
                name="photoUrl"
                onDrop={handleDrop}
                helperText={
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
                    * Recuerda habilitar el acceso a la cámara
                  </Typography>
                }
              />
              
              <Stack gap={2}>
              <RHFSelect name="type">
                <MenuItem
                  value="Carro"
                >
                  🚗 Carro
                </MenuItem>

                <MenuItem
                  value="Moto"
                >
                  🏍️ Moto
                </MenuItem>

                <MenuItem
                  value="Bicicleta"
                >
                  🚲 Bicicleta
                </MenuItem>
              </RHFSelect>

              <RHFTextField
                name="brand"
                label="Marca"
              />

              <RHFTextField 
                name="licensePlate" 
                label="Placa" 
              />

              <RHFTextField 
                name="color" 
                label="Color" 
              />

              <RHFTextField 
                name="token" 
                label="Número de ficha (bicicletero)" 
              />

              <RHFTextField 
                name="tower" 
                label="Torre" 
                disabled={!!item || !!unitId}
              />

              <RHFTextField 
                name="unit" 
                label="Unidad" 
                disabled={!!item || !!unitId}
              />
            </Stack>

            <Stack gap={2}>
              <Button
                size="large"
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {item ? 'Editar vehículo' : 'Agregar vehículo'}
              </Button>

              <Button
                size="large"
                variant="outlined"
                disabled={isSubmitting}
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}