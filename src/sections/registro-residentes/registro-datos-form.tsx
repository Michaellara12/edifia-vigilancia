import Router from 'next/router';
// form
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import { 
  Container,
  Stack, 
  Typography,
  Button,
  Divider,
  useTheme,
  Link
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import Image from 'src/components/image/Image';
import TermsConditionsDialog from './dialogs/terms-conditions-dialog';
//
import UnitsForm from './units-form';
import ResidentsForm from './residents-form';
import VehiclesForm from './vehicles-form';
import MascotsForm from './mascots-form';
// @types
import { ConjuntoDataProps } from 'src/@types/registro-residentes';
// firebase
import { DB, STORAGE } from 'src/auth/FirebaseContext';
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
//
import { useSnackbar } from "src/components/snackbar";
import { INewMascot, RegisterResidentFormValues, INewVehicle } from 'src/@types/registro-residentes';
import uuidv4 from 'src/utils/uuidv4';
import { useBoolean } from 'src/hooks/useBoolean';

// ----------------------------------------------------------------------

type IConjuntoData = {
  conjuntoData: ConjuntoDataProps
}

type onSubmitMascotsProps = {
  mascots: INewMascot[]
  unitId: string
  id: string
}

type onSubmitVehiclesProps = {
  vehicles: INewVehicle[]
  unitId: string
  id: string
}

// -----------------------------

export default function RegistroDatosForm({ conjuntoData }: IConjuntoData) {
  const { name, address, phone, email, docId, photoUrl } = conjuntoData;
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const openTermsDialog = useBoolean(false)

  const schema = Yup.object().shape({
    tower: Yup.string(),
    unit: Yup.string().required('Este campo es obligatorio'),
    coef: Yup.string(),
    type: Yup.string(),
    parkingLot: Yup.string(),
    secondParkingLot: Yup.string(),
    deposit: Yup.string(),
    secondDeposit: Yup.string(),
    residents: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required('Este campo es obligatorio'),
        lastName: Yup.string().required('Este campo es obligatorio'),
        email: Yup.string().email('Debe ser un email válido'),
        whatsapp: Yup.string(),
        cedula: Yup.string(),
        type: Yup.string().required('Este campo es obligatorio'),
      })
    )
      .min(1, 'Por favor agrega por lo menos un residente') // Ensure at least one resident is added
      .required('Este campo es obligatorio'),
    mascots: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        photoUrl: Yup.string(),
        name: Yup.string().required('Este campo es obligatorio'),
        type: Yup.string(),
        race: Yup.string(),
        color: Yup.string().required('Este campo es obligatorio')
      })
    ),
    vehicles: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        photoUrl: Yup.string(),
        brand: Yup.string(),
        type: Yup.string(),
        color: Yup.string().required('Este campo es obligatorio'),
        licensePlate: Yup.string(),
        token: Yup.string()
      })
    )
  });

  const defaultValues = {
    type: 'Apartamento',
    tower: '',
    unit: '',
    coef: '',
    parkingLot: '',
    secondParkingLot: '',
    deposit: '',
    secondDeposit: '',
    residents: [],
    mascots: [],
    vehicles: [],
  } as RegisterResidentFormValues

  const methods = useForm<RegisterResidentFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitMascots = async ({ mascots, id, unitId }: onSubmitMascotsProps) => {
    for (const mascot of mascots) {
      if (mascot.photoUrl && mascot.photoUrl !== '/assets/illustrations/dog.png' && mascot.photoUrl !== '/assets/illustrations/cat.png') {
        const storageRef = ref(STORAGE, `${id}/mascots/${mascot.id}`);

        // Convert the file (from photoUrl) to a blob
        const base64Response = await fetch((mascot.photoUrl as any ));
        const blob = await base64Response.blob();

        // Upload the blob to Firebase Storage
        const storageSnapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageSnapshot.ref);
            
        mascot.photoUrl = downloadUrl;
      }
    }

    const unitCrmRef = doc(DB, 'crm', id, 'units', unitId)
    await updateDoc(unitCrmRef, {
      mascots: mascots
    })
  }

  const onSubmitVehicles = async ({ vehicles, id, unitId }: onSubmitVehiclesProps) => {
    for (const vehicle of vehicles) {
      if (vehicle.photoUrl && vehicle.photoUrl !== '/assets/illustrations/car.png' && vehicle.photoUrl !== '/assets/illustrations/motorbike.png' && vehicle.photoUrl !== '/assets/illustrations/bike.png') {
        const storageRef = ref(STORAGE, `${id}/vehicles/${vehicle.id}`);

        // Convert the file (from photoUrl) to a blob
        const base64Response = await fetch((vehicle.photoUrl as any ));
        const blob = await base64Response.blob();

        // Upload the blob to Firebase Storage
        const storageSnapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageSnapshot.ref);
            
        vehicle.photoUrl = downloadUrl;
      }

      const basicCrmRef = doc(DB, 'basic-crm', id, 'vehicles', vehicle.id)
      await setDoc(basicCrmRef, {
        id: vehicle.id,
        color: vehicle.color,
        brand: vehicle.brand,
        licensePlate: vehicle.licensePlate,
        photoUrl: vehicle.photoUrl,
        token: vehicle.token,
        type: vehicle.type,
        unitId: unitId,
        lastActivity: {
          authAction: 'Registro',
          id: uuidv4(),
          timestamp: new Date(),
          unitId: unitId,
          vehicleId: vehicle.id
        }
      })
    }
  }


  const onSubmit = handleSubmit(async (data) => {
    const unitId = `${data.tower}${data.unit}`
    try {
      const unitCrmRef = doc(DB, 'crm', docId, 'units', unitId)
      const unitBasicCrmRef = doc(DB, 'basic-crm', docId, 'units', unitId)

      await setDoc(unitCrmRef, {
        id: unitId,
        photoUrl: data.type === 'Apartamento' ? '/assets/illustrations/apto.png' : '/assets/illustrations/casa.png',
        tower: data.tower,
        unit: data.unit,
        type: data.type,
        coef: !!data.coef ? data.coef : '',
        deposit: data.deposit,
        secondDeposit: data.secondDeposit,
        parkingLot: data.parkingLot,
        secondParkingLot: data.secondDeposit,
        mascots: [],
        vehicles: []
      })

      await setDoc(unitBasicCrmRef, {
        id: unitId,
        photoUrl: data.type === 'Apartamento' ? '/assets/illustrations/apto.png' : '/assets/illustrations/casa.png',
        tower: data.tower,
        unit: data.unit
      })

      for (const resident of data.residents) {
        const residentCrmRef = doc(DB, 'crm', docId, 'residents', resident.id)
        const residentBasicCrmRef = doc(DB, 'basic-crm', docId, 'residents', resident.id)
        await setDoc(residentCrmRef, {
          id: resident.id,
          name: resident.name,
          lastName: resident.lastName,
          cedula: resident.cedula,
          email: resident.email,
          photoUrl: resident.photoUrl,
          tower: data.tower,
          unit: data.unit,
          unitId: unitId,
          whatsapp: resident.whatsapp,
          type: resident.type
        })

        await setDoc(residentBasicCrmRef, {
          id: resident.id,
          name: resident.name,
          lastName: resident.lastName,
          photoUrl: resident.photoUrl,
          tower: data.tower,
          unit: data.unit,
          unitId: unitId,
          type: resident.type
        })
      }

      if (data.mascots && data.mascots.length > 0) {
        await onSubmitMascots({ mascots: data.mascots, id: docId, unitId: unitId })
      }

      if (data.vehicles && data.vehicles.length > 0) {
        await onSubmitVehicles({ vehicles: data.vehicles, id: docId, unitId: unitId })
      }

      enqueueSnackbar('Registro completado con éxito')
      Router.push('/registro-residentes/gracias/')
    } catch (e) {
      enqueueSnackbar(`Oops error: ${e}`, { variant: 'error' })
    }
  });

  const renderHeader = (
        <Stack gap={1} width='100%'>
          <Stack 
            direction={{xs: 'column', sm:'row'}} 
            justifyContent='space-between' 
            alignItems='center' 
            gap={3}
            sx={{ mb: 2 }}
          >
            <Stack width={360} gap={1} alignItems={{xs: 'center', md: 'flex-start'}}>
              <Image src='/logo/noman-lettering-flat.png' alt='logo' sx={{ width: 150 }}/>
              <Typography variant='caption' textAlign={{ xs: 'center', md: 'left' }}>Edifia es un plataforma de gestión de correspondencia, visitas, vehículos, PQRS especializada en propiedad horizontal.</Typography>
              <Stack direction={{xs: 'column', md:'row' }} gap={1}>
                <Button 
                  endIcon={<Iconify icon='ph:arrow-square-out-bold'/>}
                  onClick={() => {
                    window.open('https://edifiad.com', '_blank');
                  }}
                >
                  Más información
                </Button>
                <Button 
                  variant='outlined'
                  onClick={openTermsDialog.onToggle}
                >
                  Términos y condiciones
                </Button>
              </Stack>
            </Stack>
            
            <Stack direction='row' alignItems='center'>
              <Image src={photoUrl} alt='logo conjunto' sx={{ width: 100, height: 100, borderRadius: 1 }}/>
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} variant='middle'/>
              <Stack>
                <Typography variant='subtitle1'>{name}</Typography>
                <Typography variant='body1'>{address}</Typography>
                <Typography variant='caption'>{email}</Typography>
                <Typography variant='caption'>{phone}</Typography>
              </Stack>
            </Stack>
          </Stack>
          
          <Typography variant='h4'>Formulario registro de residentes ✏️</Typography>
          <Typography variant='body2'>
            Por favor, completa este formulario con tus datos básicos. 
            Así podrás autorizar visitas, recibir notificaciones sobre paquetes o correspondencia, 
            reservar zonas comunes, resolver PQRS y mucho más.
          </Typography>
        </Stack>
  )
 
  return (
    <Container maxWidth='lg' sx={{ py: 5 }}>
      {renderHeader}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <UnitsForm />
        <ResidentsForm />
        <Stack direction={{xs: 'column', md: 'row'}} gap={{xs: 1, md: 3}}>
          <MascotsForm />
          <VehiclesForm />
        </Stack>

        <Typography variant='body2' sx={{ mb: 1, mt: 2 }}>
          Los datos proporcionados se emplearán únicamente para el control de seguridad interna, reserva y uso de áreas comunes, resolución de PQRS, y 
          administración de correspondencia, visitas, domicilios y control vehicular dentro del conjunto. 
          Nos adherimos a la Ley 675 de Propiedad Horizontal y las directrices sobre protección de datos, 
          asegurando que su información no será vendida ni utilizada para marketing.
        </Typography>

        <Stack direction={ {xs: 'column', sm: "row" }} spacing={0.5}>
          <Typography variant="body2">Al hacer clic en el botón 'Registrar Información', usted acepta nuestros </Typography>

          <Link onClick={openTermsDialog.onToggle} variant="subtitle2">
            términos y Condiciones.
          </Link>
        </Stack>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          fullWidth
          sx={{ mt: 2, boxShadow: theme.customShadows.primary }}
        >
          Registrar información
        </LoadingButton>
      </FormProvider>

      <TermsConditionsDialog open={openTermsDialog.value} handleClose={openTermsDialog.onToggle}/>
    </Container>
  );
}