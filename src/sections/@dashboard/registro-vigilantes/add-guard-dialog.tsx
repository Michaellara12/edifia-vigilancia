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
import { doc, setDoc } from 'firebase/firestore';
import { DB, STORAGE } from 'src/auth/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
//
import { useSnackbar } from "src/components/snackbar";
import { useAuthContext } from 'src/auth/useAuthContext';
// types
import { IGuard } from 'src/@types/crm';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export default function AddGuard({
  open,
  onClose,
  ...other
}: DialogProps) {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  // Yup schema
  const RegisterSchema = Yup.object().shape({
    id: Yup.string().required('Este campo es obligatorio'),
    name: Yup.string().required('Este campo es obligatorio'),
    gender: Yup.string(),
    photoUrl: Yup.string().required('Este campo es obligatorio'),
  });

  const defaultValues = {
    id: '',
    name: '',
    photoUrl: '',
    gender: 'Hombre'
  }

  const methods = useForm<IGuard>({
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

  const onCreate = async (data: IGuard) => {
    try {
      let avatarUrl = '/assets/illustrations/security-person.png'
      if (data.gender === 'Mujer') {
        avatarUrl = '/assets/illustrations/security-person-female.png'
      }

      if (data.photoUrl && typeof data.photoUrl === 'string') {
        // Check if photoUrl is of type CustomFile
        const storageRef = ref(STORAGE, `${user?.uid}/guards/${data.id}`);

        // Convert the file (from photoUrl) to a blob
        const base64Response = await fetch((data.photoUrl));
        const blob = await base64Response.blob();

        // Upload the blob to Firebase Storage
        const storageSnapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageSnapshot.ref);
        data.photoUrl = downloadUrl;
      }
      

      // Create a new vehicle object
      const newItem = {
        id: data.id,
        name: data.name,
        photoUrl: data.photoUrl,
        gender: data.gender,
        avatarUrl: avatarUrl,
        isActive: true
      };

      const docRef = doc(DB, 'users', user?.uid, 'guards', data.id)
      await setDoc(docRef, newItem);

      enqueueSnackbar('Nuevo vigilante registrado')
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: 'error' })
    }
    handleClose()
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
      <DialogTitle>Registrar guarda de seguridad</DialogTitle>
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
            <Stack width='80%' alignItems='center'>
              <RHFUploadAvatar name='photoUrl' onDrop={handleDrop}/>
              <Typography variant='subtitle2' sx={{ mt: 1 }}>Subir o tomar foto de vigilante</Typography>
            </Stack>

            <Stack gap={2} width='100%'>
              <RHFTextField 
                name="name" 
                label="Nombre completo" 
                placeholder='Julian Andres Toro López'
              />

              <RHFTextField 
                name="id" 
                label="Documento de identidad (C.C)" 
                placeholder='1016115848'
              />

              {/* resident selector */}
              <RHFSelect
                name="gender"
                label="Género"
              >
                <MenuItem value='Hombre'>
                 Hombre 🧔🏻
                </MenuItem>

                <MenuItem value='Mujer'>
                  Mujer 👩🏻
                </MenuItem>
              </RHFSelect>  

              <Stack spacing={2.5}>
                <Stack gap={2}>
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Agregar vigilante
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