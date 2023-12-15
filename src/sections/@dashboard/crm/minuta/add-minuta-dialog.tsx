// @mui
import { 
  Button, 
  Dialog,
  Typography,
  DialogContent,
  Stack,
  useTheme
} from '@mui/material';
// form
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFGuardSelect } from 'src/components/hook-form';
// firebase
import { doc, setDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
//
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from "src/components/snackbar";
import { useAuthContext } from 'src/auth/useAuthContext';
//
import Image from 'src/components/image/Image';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
}

type FormValuesType = {
  notes: string
  authGuard: string
}

// ----------------------------------------------------------------------

export default function AddMinutaDialog({
  open,
  onClose,
}: DialogProps) {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const theme = useTheme()

  // Yup schema
  const RegisterSchema = Yup.object().shape({
    notes: Yup.string().required('Este campo es obligatorio'),
    authGuard: Yup.string().required('Este campo es obligatorio')
  });

  const defaultValues = {
    notes: '',
    authGuard: ''
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

  const handleClose = () => {
    reset(defaultValues)
    onClose()
  }

  const placeholder = `Describe las actividades realizadas durante la entrega del puesto, incluyendo revisión de áreas, equipos y novedades relevantes.

Ejemplo: Se reportaron fallos en el intercomunicador del bloque B, se gestionó un conflicto de ruido en el área común, se entregó correspondencia a 10 residentes y se notificó una avería en el sistema de iluminación del pasillo central.`

  const onCreate = async (data: FormValuesType) => {
    const newDocId = uuidv4()
    try {
      const docRef = doc(DB, 'basic-crm', user?.uid, 'minuta', newDocId)
      // Create a new vehicle object
      const newItem = {
        id: newDocId,
        timestamp: new Date(),
        notes: data.notes,
        authGuard: JSON.parse(data.authGuard)
      };
      await setDoc(docRef, newItem);

      enqueueSnackbar('Entrega de puesto registrada')
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: 'error' })
    }
    handleClose()
  };
  
  return (
    <>
    <Dialog maxWidth="md" open={open} onClose={onClose} fullWidth>
      <DialogContent sx={{ typography: 'body2', mb: 3 }}> 
      <FormProvider methods={methods} onSubmit={handleSubmit(onCreate)}>
        <Stack direction={{ xs: 'column' }} sx={{ width: '100%' }}>
          <Stack
           sx={{ mb: -2, width: '100%' }} 
           alignItems='center'
           justifyContent={{xs: 'center', md: 'space-between'}}
           direction={{ xs: 'column', sm: 'row' }}
          >
            <Stack width={{xs:'100%', sm:'50%'}} sx={{ my: 2 }}>
              <Typography variant='h5'>
                Reporte de entrega de turno
              </Typography>
              <Typography variant='body2'>
                Incluir cualquier incidencia, como problemas con equipos, 
                conflictos de convivencia, entrega de correspondencia, 
                estado de las áreas comunes, y cualquier otra novedad importante. 
              </Typography>
            </Stack>
            <Image src='/assets/illustrations/security-worker.png' alt='security worker'
              alignItems='center' 
              justifyContent='center'
              sx={{ width: {xs: 260, sm: 400} }}
            />
          </Stack>

          <Stack sx={{ width: '100%' }} gap={2}>
              <RHFTextField 
                name="notes" 
                label="Notas / observaciones" 
                placeholder={placeholder}
                multiline
                sx={{ mt: 1, bgcolor: theme.palette.background.paper }}
              />

              <RHFGuardSelect /> 
          </Stack>
          

        </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ width: '100%', mt: 2 }} gap={1}>
            <Button 
              fullWidth 
              variant="contained" 
              disabled={isSubmitting}
              type='submit'
            >
              Registar entrega de puesto
            </Button>
                
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
    </>
  );
}