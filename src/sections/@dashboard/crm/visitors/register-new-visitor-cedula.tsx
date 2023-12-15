import * as Yup from 'yup';
import { useState, useEffect } from 'react';
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
  RHFCameraComponent,
  RHFGuardSelect
} from 'src/components/hook-form';
import AddResidentButton from '../utils/add-resident-button';
import { v4 as uuidv4 } from 'uuid';
import Iconify from 'src/components/iconify/Iconify';
import Image from 'src/components/image/Image';
import useResponsive from 'src/hooks/useResponsive';
import useFetchResidents from '../utils/use-fetch-residents';
// utils
import { rotateImage } from '../utils/rotate-image';

// ----------------------------------------------------------------------

type FormValuesProps = {
  photoUrl: string
  cedulaPhotoUrl: string
  residentId: string
  tower: string
  unit: string
  type: 'Visitante' | 'Proveedor'
  accessType: 'Peatonal' | 'Vehicular'
  vehicleType: string
  vehicleLicensePlate: string
  vehicleColor: string
  vehicleBrand: string
  vehicleParkingLot: string
  company: string
  authGuard: string
}

// ----------------------------------------------------------------------

export default function RegisterNewVisitorCedula() {
  const { push } = useRouter();

  const { user } = useAuthContext();

  const isMobile = useResponsive('down', 'sm')

  const [unitId, setUnitId] = useState('')

  const [file, setFile] = useState<string | undefined>()
  
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    tower: Yup.string(),
    unit: Yup.string().required('Este campo es obligatorio'),
    type: Yup.string(),
    residentId: Yup.string().required('Por favor selecciona un residente').nullable(true),
    cedulaPhotoUrl: Yup.string().required('Por favor toma la foto del documento de identidad').nullable(true),
    photoUrl: Yup.string(),
    accessType: Yup.string(),
    vehicleType: Yup.string(),
    vehicleLicensePlate: Yup.string(),
    vehicleColor: Yup.string(),
    vehicleBrand: Yup.string(),
    vehicleParkingLot: Yup.string(),
    company: Yup.string(),
    authGuard: Yup.string().required('Por favor selecciona el guard que autoriza')
  });

  const defaultValues = {
    photoUrl: '',
    cedulaPhotoUrl: '',
    residentId: '',
    type: 'Visitante',
    company: '',
    tower: '',
    unit: '',
    name: '',
    cedula: '',
    accessType: 'Peatonal',
    vehicleType: 'Carro',
    vehicleLicensePlate: '',
    vehicleColor: '',
    vehicleBrand: '',
    vehicleParkingLot: '',
    authGuard: ''
  } as FormValuesProps;

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
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
    if (file) {
      setValue('cedulaPhotoUrl', file, { shouldValidate: true });
    }
  }, [file]);

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

      if (file) {
        if (isMobile) {
          // convert base64 string to blob
          const base64Response = await fetch(file)
          const blob = await base64Response.blob();
          // Rotate the image 90 degrees
          const rotatedBlob = await rotateImage(blob, 90);
          // Upload the blob to storage
          const storageSnapshot = await uploadBytes(storageRefFile, rotatedBlob);
          const downloadUrl = await getDownloadURL(storageSnapshot.ref);
          data.cedulaPhotoUrl = downloadUrl;
        } else {
          // convert base64 string to blob
          const base64Response = await fetch(file)
          const blob = await base64Response.blob();
          // Upload the blob to storage
          const storageSnapshot = await uploadBytes(storageRefFile, blob);
          const downloadUrl = await getDownloadURL(storageSnapshot.ref);
          data.cedulaPhotoUrl = downloadUrl;
        }
      }

      const vehiclePhotoUrl = data.vehicleType === 'Carro' ? carPhotoUrl : data.vehicleType === 'Moto' ? motorbikePhotoUrl : bikePhotoUrl;
      data.photoUrl = type === 'Proveedor' ? '/assets/illustrations/provider.png' : '/assets/illustrations/visitor.png'

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
        company: data.company,
        id: newDocId,
        name: '',
        photoUrl: data.photoUrl,
        cedulaPhotoUrl: data.cedulaPhotoUrl,
        residentId: data.residentId,
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
      <Typography variant='h4'>Registrar visitante con identificación</Typography>
    </Stack>

    {/* Form */}
    <FormProvider methods={methods} onSubmit={handleSubmit(onCreate)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 5, pb: 5, px: 3 }}>
            <Box>
              <RHFCameraComponent name='cedulaPhotoUrl' file={file} setFile={setFile} isIdPicture={true}/>
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
              >
                Registrar visita
              </LoadingButton>
            </Stack>
            </Stack> 
          </Card>

          {!isMobile && <Image
            disabledEffect
            alt="illustration-invite"
            src='/assets/illustrations/cedula.png'
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
