import * as Yup from 'yup';
import { useCallback } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, MenuItem, Button } from '@mui/material';
// firebase
import { useAuthContext } from 'src/auth/useAuthContext';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { DB, STORAGE } from 'src/auth/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar
} from 'src/components/hook-form';
import { v4 as uuidv4 } from 'uuid';
import Iconify from 'src/components/iconify/Iconify';
import Image from 'src/components/image/Image';
import useResponsive from 'src/hooks/useResponsive';
//
import { cleanTowerUnitValues } from 'src/utils/clean-tower-unit-values';

// ----------------------------------------------------------------------

type FormValuesProps = {
  id: string
  unitId: string
  unit: string
  tower: string
  type: string
  photoUrl: string
  notes: string
}
// ----------------------------------------------------------------------

export default function RegisterNewMail() {
  const { push } = useRouter();

  const { user } = useAuthContext();

  const isMobile = useResponsive('down', 'sm')

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    unit: Yup.string().required('Este campo es obligatorio'),
    tower: Yup.string(),
    type: Yup.string(),
    photoUrl: Yup.string().required('Por favor agrega una foto del paquete o correspondencia').nullable(true),
    notes: Yup.string()
  });

  const defaultValues = {
    unit: '',
    tower: '',
    type: 'Paquete',
    photoUrl: '',
    notes: ''
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onCreate = async (data: FormValuesProps) => {
    try {
      const [cleanTower, cleanUnit, unitId] = cleanTowerUnitValues(data.tower, data.unit)
      const newDocId = uuidv4();
      // check if unit exists
      const unitRef = doc(DB, 'basic-crm', user?.uid, 'units', unitId)
      const unitDoc = await getDoc(unitRef);
      if (!unitDoc.exists()) {
        throw new Error('Esta unidad no existe, si la torre usa letras prueba agregandola en minuscula o mayuscula');
      }
      const docRef = doc(DB, 'basic-crm', user?.uid, 'packages', newDocId);
      const storageRef = ref(STORAGE, `${user?.uid}/packages/${newDocId}`); // Fixed storageRef path
  
      if (data.photoUrl && typeof data.photoUrl === 'string') {
        // convert base64 string to blob
        const base64Response = await fetch(data.photoUrl)
        const blob = await base64Response.blob();
        // Upload the blob to storage
        const storageSnapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageSnapshot.ref);
        
        data.id = newDocId;
        data.unitId = unitId;
        data.photoUrl = downloadUrl;
        data.tower = cleanTower;
        data.unit = cleanUnit;
  
        await setDoc(docRef, {
          ...data,
          arrivalDate: serverTimestamp(),
        });
        push(PATH_DASHBOARD.registroCorrespondencia.root);
        enqueueSnackbar('Nuevo paquete agregado');
      } else {
        enqueueSnackbar('Archivo no proporcionado', { variant: 'error' });
        return;
      }
    } catch (e) {
      enqueueSnackbar(`Oops error: ${e}`, { variant: 'error' });
    }
  };

  const handleReturnButton = () => {
    push(PATH_DASHBOARD.registroCorrespondencia.root);
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

  return (
    <>
    {/* Header */}
    <Stack direction='row' gap={2} sx={{ mb: 2 }}>
      <Button 
        variant='outlined' 
        color='inherit'
        onClick={handleReturnButton}
      >
        <Iconify icon='pajamas:go-back'/>
      </Button>
      <Typography variant='h4'>Registrar paquete o correpondencia</Typography>
    </Stack>

    {/* Form */}
    <FormProvider methods={methods} onSubmit={handleSubmit(onCreate)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 5, pb: 5, px: 3 }}>
            <Box>
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
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="tower" label="Torre" placeholder='2'/>
              <RHFTextField name="unit" label="Unidad o apartamento" placeholder='102'/>
            </Box>

            <RHFSelect name="type" label='Tipo de correspondencia' sx={{ mt: 2 }}>
                <MenuItem
                  value="Paquete"
                >
                  📦 Paquete
                </MenuItem>

                <MenuItem
                  value="Sobre"
                >
                  📩 Sobre | Documento | Correspondencia
                </MenuItem>
              </RHFSelect>  

            <RHFTextField 
              name="notes" 
              label="Notas u observaciones" 
              sx={{ mt: 2 }}
              placeholder={`El paquete lleva varios adhesivos indicando 'Fragile' y 'No Inclinar'. Es necesario almacenarlo en un lugar plano y evitar colocar objetos pesados encima.`}
              multiline
              rows={4}
            />
            
            <Stack alignItems='flex-end' sx={{ mt: 2 }}>
              <LoadingButton 
                type="submit" 
                variant="contained" 
                loading={isSubmitting} 
                startIcon={<Iconify icon='mdi:box-variant-closed-add'/>}
                sx={{ 
                  px: 3, 
                  py: 2, 
                  width: {xs: '100%', sm: 'auto'} 
                }}
              >
                Agregar paquete
              </LoadingButton>
            </Stack>
          </Card>

          {!isMobile && <Image
            disabledEffect
            alt="illustration-invite"
            src='/assets/illustrations/delivery.png'
            sx={{
              mt: -12,
              left: 15,
              zIndex: 9,
              width: 240,
              position: 'relative',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.1))',
            }}
          />}
        </Grid>
      </Grid>
      {isMobile && 
        <Stack sx={{ p: 2 }} alignItems='center'>
          <Image
            disabledEffect
            alt="illustration-invite"
            src='/assets/illustrations/delivery.png'
          />
        </Stack>
      }
    </FormProvider>
    </>
  );
}
