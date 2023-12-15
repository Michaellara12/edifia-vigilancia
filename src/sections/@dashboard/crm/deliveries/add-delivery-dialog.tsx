import { useState, useEffect, useCallback } from 'react';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  MenuItem,
  Avatar,
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
// utils
import AddResidentButton from '../utils/add-resident-button';
import useFetchResidents from '../utils/use-fetch-residents';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
}

type FormValuesType = {
  photoUrl: string
  residentId: string
  tower?: string
  unit: string
};

// ----------------------------------------------------------------------

export default function AddDeliveryDialog({
  open,
  onClose,
  ...other
}: DialogProps) {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const [unitId, setUnitId] = useState('')

  // Yup schema
  const RegisterSchema = Yup.object().shape({
    photoUrl: Yup.string(),
    tower: Yup.string(),
    unit: Yup.string().required('Este campo es obligatorio'),
    residentId: Yup.string().required('Este campo es obligatorio'),
    notes: Yup.string()
  });

  const defaultValues = {
    photoUrl: '',
    residentId: '',
    tower: '',
    unit: ''
  }

  const methods = useForm<FormValuesType>({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const tower = watch("tower");
  const unit = watch("unit");

  useEffect(() => {
    if (!!unit) {
      setUnitId(`${tower}${unit}`)
    }
  }, [unit, tower])

  const { residents } = useFetchResidents(unitId)

  const handleClose = () => {
    reset(defaultValues)
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
    const fallbackPhotoUrl = '/assets/illustrations/delivery-person.png'
    try {
      const unitRef = doc(DB, 'basic-crm', user?.uid, 'units', `${data.tower}${data.unit}`)
      const unitDoc = await getDoc(unitRef);
      if (!unitDoc.exists()) {
        throw new Error('Esta unidad no existe, si la torre usa letras prueba agregandola en minuscula o mayuscula');
      }
      // assign vehicle photo
      const docRef = doc(DB, 'basic-crm', user?.uid, 'deliveries', newDocId)
      let photoUrl = ''
      if (data.photoUrl && typeof data.photoUrl === 'string') {
        const storageRef = ref(STORAGE, `${user?.uid}/deliveries/${newDocId}`); // Fixed storageRef path
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

      // Create a new vehicle object
      const newItem = {
        id: newDocId,
        arrivalDate: serverTimestamp(),
        photoUrl: photoUrl,
        unitId: `${data.tower}${data.unit}`,
        residentId: data.residentId,
        authResident: residents.find(resident => resident.id === data.residentId)
      };
      await setDoc(docRef, newItem);

      enqueueSnackbar('Nuevo domicilio registrado')
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: 'error' })
    }
    handleClose()
  };

  
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
      <DialogTitle>Agregar domicilio</DialogTitle>
      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 3 }}> 
        <FormProvider methods={methods} onSubmit={handleSubmit(onCreate)}>
          <Stack 
            direction={{xs: 'column', sm:'row' }}
            gap={1} 
            width='100%' 
            alignItems='center' 
            justifyContent='center'
            sx={{ mb: 1, mt: 1 }}
          >
            <Stack width='80%'>
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
            </Stack>
            

            <Stack gap={2} width='100%'>
              <Stack direction='row' gap={2}>
                <RHFTextField 
                  name="tower" 
                  label="Torre" 
                />

                <RHFTextField 
                  name="unit" 
                  label="Unidad" 
                />
              </Stack>

              {/* resident selector */}
              <RHFSelect
                name="residentId"
                label="Residente que autoriza"
                native={false} // Use native dropdown or MUI dropdown, adjust as needed
              >
                  {residents.map((resident) => (
                    <MenuItem key={resident.id} value={resident.id}>
                      <Stack direction='row' alignItems='center'>
                        <Avatar src={resident.photoUrl} alt={resident.name} sx={{ ml: -0.5, mr: 1 }} />
                        <Stack>
                          <Typography variant='subtitle2'>
                            {resident.name} {resident.lastName}
                          </Typography>
                          <Typography variant='caption'>
                            {resident.type}
                          </Typography>
                        </Stack>
                      </Stack>
                    </MenuItem>
                  ))}
              </RHFSelect>  

              <AddResidentButton />

              <RHFTextField 
                name="notes" 
                label="Notas / observaciones" 
              />

              <Stack spacing={2.5}>
                <Stack gap={2}>
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Agregar domicilio
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
            </Stack>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}