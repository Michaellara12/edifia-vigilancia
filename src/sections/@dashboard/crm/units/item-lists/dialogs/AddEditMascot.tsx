import { useEffect } from 'react';
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
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
// @types
import { IUnitMascot } from 'src/@types/crm';
// firebase
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
//
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from "src/components/snackbar";
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  item: IUnitMascot | null | undefined;
  unitId: string;
}

type FormValuesType = {
  photoUrl: string
  type: string
  race?: string
  name: string
  color: string
};

// ----------------------------------------------------------------------

export default function AddEditMascot({
  open,
  onClose,
  item,
  unitId,
  ...other
}: DialogProps) {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const dogPhotoUrl = '/assets/illustrations/dog.png';

  const catPhotoUrl = '/assets/illustrations/cat.png';

  const hasItemData = !!item;

  // Yup schema
  const RegisterSchema = Yup.object().shape({
    type: Yup.string(),
    race: Yup.string(),
    name: Yup.string().required('Este campo es obligatorio'),
    color: Yup.string().required('Este campo es obligatorio'),
  });

  const defaultValues = {
    photoUrl: item?.photoUrl,
    type: item?.type ? item?.type : 'Perro',
    race: item?.race,
    name: item?.name,
    color: item?.color,
  } as FormValuesType;

  const resetValues = {
    photoUrl: '',
    type: 'Perro',
    race: '',
    name: '',
    color: ''
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
      reset(resetValues) // Clean current item values
    } else {
      reset(defaultValues) // Add current item values
    }
  }, [item, hasItemData])

  const handleClose = () => {
    // cleans form fields
    // in case is a new item
    if (!hasItemData) {
      reset(resetValues)
    }
    onClose()
  }

  const onCreate = async (data: FormValuesType) => {
    const newDocId = uuidv4()
    
    try {
      const docRef = doc(DB, 'crm', user?.uid, 'units', unitId)
      const photoUrl = data.type === 'Perro' ? dogPhotoUrl : catPhotoUrl
      const race = data.race ? data.race : ''

      // Create a new mascot object
      const newMascot = {
        id: newDocId,
        photoUrl: photoUrl,
        type: data.type,
        race: race,
        name: data.name,
        color: data.color
      };

      // Update the 'mascots' array using arrayUnion
      await updateDoc(docRef, {
        mascots: arrayUnion(newMascot)
      });
      enqueueSnackbar('Nueva mascota agregada')
    } catch (e) {
      enqueueSnackbar('No fue posible agregar esta mascota', { variant: 'error' })
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
  
        // Find the index of the object you want to edit in the 'mascots' array
        const mascotsArray = currentData.mascots || [];
        const indexToUpdate = mascotsArray.findIndex((mascot: IUnitMascot) => mascot.id === item?.id);
        const photoUrl = data.type === 'Perro' ? dogPhotoUrl : catPhotoUrl
  
        if (indexToUpdate !== -1) {
          // Create a new mascot object with updated data
          const updatedMascot = {
            ...mascotsArray[indexToUpdate],
            photoUrl: photoUrl,
            type: data.type,
            race: data.race ? data.race : '',
            name: data.name,
            color: data.color
          };
  
          // Update the 'mascots' array with the modified object
          mascotsArray[indexToUpdate] = updatedMascot;
  
          // Update the document with the modified 'mascots' array
          await updateDoc(docRef, { mascots: mascotsArray });
  
          enqueueSnackbar('Mascota actualizada');
        } else {
          enqueueSnackbar('No se encontró la mascota para actualizar', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Documento no encontrado', { variant: 'error' });
      }
    } catch (e) {
      enqueueSnackbar('No fue posible actualizar la mascota', { variant: 'error' });
    }
    handleClose();
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle>{hasItemData ? "Editar mascota" : "Agregar mascota"}</DialogTitle>

      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 2 }}> 
        <FormProvider methods={methods} onSubmit={hasItemData ? handleSubmit(onEdit) : handleSubmit(onCreate)}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFSelect name="type">
                <MenuItem
                  value="Perro"
                >
                  🐶 Perro
                </MenuItem>

                <MenuItem
                  value="Gato"
                >
                  🐱 Gato
                </MenuItem>
              </RHFSelect>

              <RHFTextField
                name="name"
                label="Nombre"
              />

              <RHFTextField 
                name="race" 
                label="Raza" 
              />

              <RHFTextField 
                name="color" 
                label="Color" 
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
                {hasItemData ? 'Editar mascota' : 'Agregar mascota'}
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