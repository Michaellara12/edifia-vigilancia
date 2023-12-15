import { useEffect, useState } from 'react';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  MenuItem,
} from '@mui/material';
// form
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFSelect, RHFCameraComponent } from 'src/components/hook-form';
// @types
import { IUnitVehicle } from 'src/@types/crm';
// firebase
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { DB, STORAGE } from 'src/auth/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
//
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from "src/components/snackbar";
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  item: IUnitVehicle | null | undefined;
  unitId: string;
}

type FormValuesType = {
  photoUrl: string
  brand: string
  color: string
  licensePlate?: string
  type: string
  token?: string
};

// ----------------------------------------------------------------------

export default function AddEditVehicle({
  open,
  onClose,
  item,
  unitId,
  ...other
}: DialogProps) {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const [file, setFile] = useState<string | undefined>()

  const carPhotoUrl = '/assets/illustrations/car.png';

  const motorbikePhotoUrl = '/assets/illustrations/motorbike.png';

  const bikePhotoUrl = '/assets/illustrations/bike.png';

  const hasItemData = !!item;

  // Yup schema
  const RegisterSchema = Yup.object().shape({
    photoUrl: Yup.string(),
    type: Yup.string(),
    color: Yup.string().required('Este campo es obligatorio'),
    brand: Yup.string(),
    licensePlate: Yup.string(),
    token: Yup.string(),
  });

  const defaultValues = {
    photoUrl: item?.photoUrl,
    type: item?.type ? item?.type : 'Carro',
    brand: item?.brand,
    licensePlate: item?.licensePlate,
    color: item?.color,
    token: item?.token
  } as FormValuesType;

  const resetValues = {
    photoUrl: '',
    type: 'Carro',
    brand: '',
    licensePlate: '',
    color: '',
    token: ''
  }

  const methods = useForm<FormValuesType>({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!hasItemData) {
      setFile(undefined)
      reset(resetValues) // Clean current item values
    } else {
      reset(defaultValues) // Add current item values
    }
  }, [item, hasItemData])

  const onCreate = async (data: FormValuesType) => {
    const newDocId = uuidv4()
    
    try {
      const docRef = doc(DB, 'crm', user?.uid, 'units', unitId)
      const storageRef = ref(STORAGE, `${user?.uid}/vehicles/${newDocId}`); // Fixed storageRef path
      
      const brand = data.brand ? data.brand : ''
      const licensePlate = data.licensePlate ? data.licensePlate : ''
      const token = data.token ? data.token : ''
      
      if (file) {
        // convert base64 string to blob
        const base64Response = await fetch(file)
        const blob = await base64Response.blob();
        // Upload the blob to storage
        const storageSnapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageSnapshot.ref);

        // Create a new vehicle object
        const newItem = {
          id: newDocId,
          photoUrl: downloadUrl,
          type: data.type,
          brand: brand,
          licensePlate: licensePlate,
          color: data.color,
          token: token
        };

        // Update the 'vehicles' array using arrayUnion
        await updateDoc(docRef, {
          vehicles: arrayUnion(newItem)
        });
      } else {
        const fallbackPhotoUrl = data.type === 'Carro' ? carPhotoUrl : data.type === 'Moto' ? motorbikePhotoUrl : bikePhotoUrl;
        // Create a new vehicle object
        const newItem = {
          id: newDocId,
          photoUrl: fallbackPhotoUrl,
          type: data.type,
          brand: brand,
          licensePlate: licensePlate,
          color: data.color,
          token: token
        };

        // Update the 'vehicles' array using arrayUnion
        await updateDoc(docRef, {
          vehicles: arrayUnion(newItem)
        });
      }
      enqueueSnackbar('Nuevo vehículo  agregado')
    } catch (e) {
      enqueueSnackbar('No fue posible agregar este vehículo', { variant: 'error' })
    }
    handleClose()
  };

  const onEdit = async (data: FormValuesType) => {
    try {
      const docRef = doc(DB, 'crm', user?.uid, 'units', unitId);
  
      // Get the current document data
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const currentData = docSnapshot.data();
  
        // Find the index of the object you want to edit in the 'vehicles' array
        const itemsArray = currentData.vehicles || [];
        const indexToUpdate = itemsArray.findIndex((vehicle: IUnitVehicle) => vehicle.id === item?.id);
        if (indexToUpdate !== -1) {
          // Create a new vehicle object with updated data
          const updatedItem = {
            ...itemsArray[indexToUpdate],
            photoUrl: data.photoUrl,
            type: data.type,
            licensePlate: data.licensePlate,
            brand: data.brand,
            color: data.color,
            token: data.token
          };
  
          // Update the 'vehículos' array with the modified object
          itemsArray[indexToUpdate] = updatedItem;
  
          // Update the document with the modified 'vehículos' array
          await updateDoc(docRef, { vehicles: itemsArray });
  
          enqueueSnackbar('vehículo actualizado');
        } else {
          enqueueSnackbar('No se encontró el vehículo para actualizar', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Documento no encontrado', { variant: 'error' });
      }
    } catch (e) {
      enqueueSnackbar('No fue posible actualizar el vehículo', { variant: 'error' });
    }
    handleClose();
  };

  const handleClose = () => {
    // cleans form fields in case is a new item
    if (!hasItemData) {
      setFile(undefined) // cleans current picture taken
      reset(resetValues) 
    }
    onClose()
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle>{hasItemData ? "Editar vehículo" : "Agregar vehículo"}</DialogTitle>

      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 2 }}> 
        <FormProvider methods={methods} onSubmit={hasItemData ? handleSubmit(onEdit) : handleSubmit(onCreate)}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
              {hasItemData
              ?
                null 
              :
                <RHFCameraComponent name="photoUrl" file={file} setFile={setFile} />
              }
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
            </Stack>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              justifyContent='right'
            >
              <Button
                size="large"
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {hasItemData ? 'Editar vehículo' : 'Agregar vehículo'}
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