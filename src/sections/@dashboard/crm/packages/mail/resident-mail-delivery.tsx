import * as Yup from 'yup';
import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { 
  Card, 
  Grid, 
  Stack, 
  Typography, 
  Button, 
  Divider,
  Avatar,
  MenuItem,
} from '@mui/material';
// firebase
import { useAuthContext } from 'src/auth/useAuthContext';
import { DB, STORAGE } from 'src/auth/FirebaseContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// components
import FormProvider from 'src/components/hook-form';
import RHFSignature from 'src/components/hook-form/RHFSignature';
import { RHFSelect, RHFGuardSelect } from 'src/components/hook-form';
import AddResidentButton from '../../utils/add-resident-button';
//
import { RenderPackageData } from './render-package-data';
import Iconify from 'src/components/iconify/Iconify';
import ImageComponent from 'src/components/image/Image';
import { ResidentMailDeliveryLoading } from './utils/resident-mail-delivery-loading';
import Page404 from 'src/pages/404';
// hooks
import useResponsive from 'src/hooks/useResponsive';
import useFetchPackageData from './utils/use-fetch-package-data';
import { useSnackbar } from 'src/components/snackbar';
// utils
import { rotateImage } from '../../utils/rotate-image';
import { ImageLightbox } from 'src/components/image';

// ----------------------------------------------------------------------

export default function ResidentMailDelivery() {

  const isMobile = useResponsive('down', 'sm')

  // get package Id
  const { query, push } = useRouter();
  const itemId = query.itemId as string;
  
  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const { packageData, loading, error, residents } = useFetchPackageData()

  const [signature, setSignature] = useState<string | null>(null)

  const itemSchema = Yup.object().shape({
    authGuard: Yup.string().required('Por favor seleccionar el guarda que autoriza'),
    signature: Yup.string().required('Por favor agrega la firma de la persona que recibe el paquete o correspondencia').nullable(true),
    resident: Yup.string().required('Por favor selecciona un residente').nullable(true)
  })

  type FormValuesProps = {
    authGuard: string
    signature: string
    resident: string
  }

  const defaultValues = {
    signature: '',
    resident: ''
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(itemSchema),
    defaultValues
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Set the form value whenever a new signature is added
  useEffect(() => {
    if (signature) {
      setValue('signature', signature, { shouldValidate: true })
    }
  }, [signature])

  const handleReturnButton = () => {
    push(PATH_DASHBOARD.registroCorrespondencia.root);
  }

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const docRef = doc(DB, 'basic-crm', user?.uid, 'packages', itemId)
      const storageRef = ref(STORAGE, `${user?.uid}/packages/${itemId}-signature`);
    
      if (signature) {
        // Convert base64 string to blob
        const base64Response = await fetch(signature);
        const blob = await base64Response.blob();
    
        if (isMobile) {
          // Rotate the image 90 degrees
          const rotatedBlob = await rotateImage(blob, 90);
          // Upload the rotated blob to storage
          const storageSnapshot = await uploadBytes(storageRef, rotatedBlob);
          const downloadUrl = await getDownloadURL(storageSnapshot.ref);
    
          data.signature = downloadUrl;
        } else {
          // Upload the original blob to storage
          const storageSnapshot = await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageSnapshot.ref);
    
          data.signature = downloadUrl;
        }
      }
  
      await updateDoc(docRef, {
        ...packageData,
        signature: data.signature,
        pickupDate: serverTimestamp(),
        residentId: data.resident,
        authGuard: JSON.parse(data.authGuard)

      });
      
      enqueueSnackbar('Paquete entregado');
      push(PATH_DASHBOARD.registroCorrespondencia.root);
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' })
    }
  }

  if (loading) return <ResidentMailDeliveryLoading />

  if (error) return <Page404 />

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
      <Typography variant='h4'>Entregar correspondencia 📨</Typography>
    </Stack>

    {/* Form */}
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 5, px: 3, display: 'flex', justifyContent: 'center' }}>
            {packageData?.photoUrl && <ImageLightbox image={packageData.photoUrl}/>}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack direction='row' width='100%' alignItems='flex-start' justifyContent='space-between' >
              {packageData && <RenderPackageData packageData={packageData}/>}

              {!isMobile && <ImageComponent
                disabledEffect
                alt="illustration-invite"
                src='/assets/illustrations/hand-delivery.png'
                sx={{ 
                  width: 180, 
                  minWidth: 140 // prevents the image from shrinking
                }}
              />}
            </Stack>
            
            <Divider sx={{ my: 2 }}/>

            <Stack gap={2}>
              {/* resident selector */}
              <RHFSelect
                name="resident"
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

              <AddResidentButton tower={packageData?.tower} unit={packageData?.unit}/> 

              <RHFGuardSelect />   
              
              <RHFSignature name='signature' signature={signature} setSignature={setSignature}/>
            </Stack>
            
            
            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton 
                type="submit" 
                variant="contained" 
                loading={isSubmitting} 
                startIcon={<Iconify icon='gg:check-o'/>}
                sx={{ 
                  px: 3, 
                  py: 2, 
                  width: {xs: '100%', sm: 'auto'} 
                }}
              >
                Confirmar entrega
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
    </>
  );
}