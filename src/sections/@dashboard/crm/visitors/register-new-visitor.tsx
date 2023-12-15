import * as Yup from 'yup';
import { useState, useEffect, useCallback } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, MenuItem, Button, Divider, Avatar } from '@mui/material';
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
  RHFUploadAvatar,
  RHFGuardSelect
} from 'src/components/hook-form';
import AddResidentButton from '../utils/add-resident-button';
import RHFSignature from 'src/components/hook-form/RHFSignature';
import { v4 as uuidv4 } from 'uuid';
import Iconify from 'src/components/iconify/Iconify';
import Image from 'src/components/image/Image';
// hooks
import useResponsive from 'src/hooks/useResponsive';
import useFetchResidents from '../utils/use-fetch-residents';
// utils
import { rotateImage } from '../utils/rotate-image';

// ----------------------------------------------------------------------

type FormValuesProps = {
  id: string
  photoUrl: string
  signature: string
  residentId: string
  tower: string
  unit: string
  name: string
  cedula: string
  notes: string
  type: 'Visitante' | 'Proveedor'
  accessType: 'Peatonal' | 'Vehicular'
  vehicleType: string
  vehicleLicensePlate: string
  vehicleColor: string
  vehicleBrand: string
  vehicleParkingLot: string
  unitId: string
  company: string
  authGuard: string
}

// ----------------------------------------------------------------------

export default function RegisterNewVisitor() {
  const { push } = useRouter();

  const { user } = useAuthContext();

  const isMobile = useResponsive('down', 'sm')

  const [unitId, setUnitId] = useState('')

  const [signature, setSignature] = useState<string | null>(null)
  
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    tower: Yup.string(),
    unit: Yup.string().required('Este campo es obligatorio'),
    name: Yup.string().required('Este campo es obligatorio'),
    type: Yup.string(),
    cedula: Yup.string(),
    notes: Yup.string(),
    residentId: Yup.string().required('Por favor selecciona un residente').nullable(true),
    signature: Yup.string(),
    photoUrl: Yup.string(),
    accessType: Yup.string(),
    vehicleType: Yup.string(),
    vehicleLicensePlate: Yup.string(),
    vehicleColor: Yup.string(),
    vehicleBrand: Yup.string(),
    vehicleParkingLot: Yup.string(),
    company: Yup.string(),
    authGuard: Yup.string().required('Por favor selecciona un guarda')
  });

  const defaultValues = {
    photoUrl: '',
    signature: '',
    residentId: '',
    type: 'Visitante',
    company: '',
    tower: '',
    unit: '',
    name: '',
    cedula: '',
    notes: '',
    accessType: 'Peatonal',
    vehicleType: 'Carro',
    vehicleLicensePlate: '',
    vehicleColor: '',
    vehicleBrand: '',
    vehicleParkingLot: ''
  } as FormValuesProps;

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const accessType = watch("accessType");
  const tower = watch("tower");
  const unit = watch("unit");
  const type = watch("type");

  useEffect(() => {
    if (!!unit) {
      setUnitId(`${tower}${unit}`)
    }
  }, [unit, tower])

  // Get residents for resident selector
  const { residents } = useFetchResidents(unitId)

  useEffect(() => {
    if (signature) {
      setValue('signature', signature, { shouldValidate: true });
    }
  }, [signature]);

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

  const carPhotoUrl = '/assets/illustrations/car.png';
  const motorbikePhotoUrl = '/assets/illustrations/motorbike.png';
  const bikePhotoUrl = '/assets/illustrations/bike.png';

  const onCreate = async (data: FormValuesProps) => {
    try {
      const newDocId = uuidv4();
      const unitId = `${data.tower}${data.unit}`;
      // check if unit exists
      const unitRef = doc(DB, 'basic-crm', user?.uid, 'units', unitId)
      const unitDoc = await getDoc(unitRef);
      if (!unitDoc.exists()) {
        throw new Error('Esta unidad no existe, si la torre usa letras prueba agregandola en minuscula o mayuscula');
      }
      const docRef = doc(DB, 'basic-crm', user?.uid, 'visitors', newDocId);
      const storageRefFile = ref(STORAGE, `${user?.uid}/visitors/file_${newDocId}`);
      const storageRefSignature = ref(STORAGE, `${user?.uid}/visitors/signature_${newDocId}`);

      if (data.photoUrl && typeof data.photoUrl === 'string') {
        // convert base64 string to blob
        const base64Response = await fetch(data.photoUrl)
        const blob = await base64Response.blob();
        // Upload the blob to storage
        const storageSnapshot = await uploadBytes(storageRefFile, blob);
        const downloadUrl = await getDownloadURL(storageSnapshot.ref);
        data.photoUrl = downloadUrl;
      } else {
        data.photoUrl = type === 'Proveedor' ? '/assets/illustrations/provider.png' : '/assets/illustrations/visitor.png'
      }

      if (signature) {
        // Convert base64 string to blob
        const base64Response = await fetch(signature);
        const blob = await base64Response.blob();
    
        if (isMobile) {
          // Rotate the image 90 degrees
          const rotatedBlob = await rotateImage(blob, 90);
          // Upload the rotated blob to storage
          const storageSnapshot = await uploadBytes(storageRefSignature, rotatedBlob);
          const downloadUrl = await getDownloadURL(storageSnapshot.ref);
    
          data.signature = downloadUrl;
        } else {
          // Upload the original blob to storage
          const storageSnapshot = await uploadBytes(storageRefSignature, blob);
          const downloadUrl = await getDownloadURL(storageSnapshot.ref);
    
          data.signature = downloadUrl;
        }
      }
      const vehiclePhotoUrl = data.vehicleType === 'Carro' ? carPhotoUrl : data.vehicleType === 'Moto' ? motorbikePhotoUrl : bikePhotoUrl;

      const vehicleData = {
        vehiclePhotoUrl: vehiclePhotoUrl,
        vehicleBrand: data.vehicleBrand,
        vehicleColor: data.vehicleColor,
        vehicleLicensePlate: data.vehicleLicensePlate,
        vehicleParkingLot: data.vehicleParkingLot,
        vehicleType: data.vehicleType
      }

      const payload = {
        accessType: data.accessType,
        arrivalDate: serverTimestamp(),
        cedula: data.cedula,
        company: data.company,
        id: newDocId,
        name: data.name,
        notes: data.notes,
        photoUrl: data.photoUrl,
        residentId: data.residentId,
        signature: data.signature,
        tower: data.tower,
        unit: data.unit,
        type: data.type,
        unitId: unitId,
        vehicle: data.accessType === 'Peatonal' ? null : vehicleData,
        authGuard: JSON.parse(data.authGuard)
      }

      await setDoc(docRef, payload);
      push(PATH_DASHBOARD.registroIngresoPersonas.root);
      enqueueSnackbar('Nuevo visitante agregado');
    } catch (e) {
      enqueueSnackbar(`Oops error: ${e}`, { variant: 'error' });
    }
  };

  const handleReturnButton = () => {
    push(PATH_DASHBOARD.registroIngresoPersonas.root);
  }

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
      <Typography variant='h4'>Registrar visitante 📝</Typography>
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
            <Stack gap={2}>
            
            <RHFSelect name="type" label='Tipo de visita'>
                <MenuItem
                  value="Visitante"
                >
                  🧍 Visitante
                </MenuItem>

                <MenuItem
                  value="Proveedor"
                >
                  ⚒️ Proveedor de servicios
                </MenuItem>
            </RHFSelect>

            {type === 'Proveedor' && <RHFTextField name="company" label="Empresa" />}

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="tower" label="Torre" />
              <RHFTextField name="unit" label="Unidad" />
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              
              <RHFTextField name="name" label="Nombre completo del visitante" />
              <RHFTextField name="cedula" label="Cédula" />
              
            </Box>

            <RHFTextField name="notes" label="Observaciones o motivo de visita"/>

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

            <RHFGuardSelect />

            <Divider sx={{ my: 1 }}/>

            <Box>
              <RHFSelect name="accessType" label='Tipo de ingreso'>
                <MenuItem
                  value="Peatonal"
                >
                  Peatonal 🚶‍♂️
                </MenuItem>

                <MenuItem
                  value="Vehicular"
                >
                  Vehicular 🚗
                </MenuItem>
              </RHFSelect>
            </Box>

            {accessType === 'Vehicular' && (
              <>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  }}
                >
                  <RHFSelect name="vehicleType" label='Tipo de vehículo'>
                    <MenuItem value="Carro">🚙 Carro</MenuItem>
                    <MenuItem value="Moto">🛵 Moto</MenuItem>
                    <MenuItem value="Bicicleta">🚲 Bicicleta</MenuItem>
                  </RHFSelect>
                  <RHFTextField name="vehicleLicensePlate" label="Placa" />
                  <RHFTextField name="vehicleColor" label="Color del vehículo" />
                </Box>

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name="vehicleBrand" label="Marca" />
                  <RHFTextField name="vehicleParkingLot" label="Parqueadero provisional" />
                </Box>
              </>
            )}
      
            <RHFSignature name='signature' signature={signature} setSignature={setSignature}/>
            
            <Stack alignItems='flex-end'>
              <LoadingButton 
                type="submit" 
                variant="contained" 
                loading={isSubmitting} 
                startIcon={<Iconify icon='material-symbols:person-add-rounded'/>}
                sx={{ 
                  px: 3, 
                  py: 2, 
                  width: {xs: '100%', sm: 'auto'} 
                }}
                color={Object.keys(errors).length === 0 ? 'primary' : 'error'}
              >
                Registrar visita
              </LoadingButton>
              {/* Helper text if error */}
              {Object.keys(errors).length > 0 &&
                <Typography 
                  variant='caption' 
                  color='error' 
                  sx={{ mt: 1 }}
                  maxWidth={{xs: '100', sm: 300, md: 400, lg: 360}}
                  textAlign={{ xs: 'center', sm: 'right' }}
                >
                  Parece que no has completado campos obligatorios o hay errores, 
                  por favor asegúrate que todos los campos han sido completados correctamente.
                </Typography>
              }
            </Stack>
            </Stack> 
          </Card>

          {!isMobile && <Image
            disabledEffect
            alt="illustration-invite"
            src='/assets/illustrations/people.png'
            sx={{
              mt: -14,
              left: 15,
              zIndex: 9,
              width: 210,
              position: 'relative',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.1))',
            }}
          />}
        </Grid>
      </Grid>
    </FormProvider>
    </>
  );
}
