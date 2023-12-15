import * as Yup from 'yup';
import { useState, useEffect, useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Divider, InputAdornment } from '@mui/material';
// firebase
import { useAuthContext } from 'src/auth/useAuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DB, STORAGE, AUTH } from 'src/auth/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar
} from 'src/components/hook-form';
import Iconify from 'src/components/iconify/Iconify';
import Image from 'src/components/image/Image';
import useResponsive from 'src/hooks/useResponsive';
import { fData } from 'src/utils/formatNumber';
import { CustomFile } from 'src/components/upload';
import { v4 as uuidv4 } from 'uuid';
import { IncrementerButton } from 'src/components/custom-input';
import CopyBox from 'src/components/copy-box';

// ----------------------------------------------------------------------

type FormValuesProps = {
  photoUrl: CustomFile | string | null
  name: string
  address: string
  nameAdmin: string
  cedula: string
  email: string
  phone: string
  members: string
  freeHours: number
  carHours: number
  motoHours: number
}

// ----------------------------------------------------------------------

export default function Cuenta() {
  const { user } = useAuthContext();

  const isMobile = useResponsive('down', 'sm')

  const { enqueueSnackbar } = useSnackbar();

  const [propertyData, setPropertyData] = useState<FormValuesProps>({
    photoUrl: '',
    name: '',
    address: '',
    nameAdmin: '',
    cedula: '',
    email: '',
    phone: '',
    members: '',
    freeHours: 0,
    carHours: 0,
    motoHours: 0
  });

  useEffect(() => {
    const getDocData = async () => {
      if (user?.uid) {
        const docRef = doc(DB, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // 2. Update the state with the retrieved data
          setPropertyData(docSnap.data() as FormValuesProps);
        } else {
          console.log("No such document!");
        }
      }
    };
    getDocData();
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string(),
    address: Yup.string().required('Este campo es obligatorio'),
    nameAdmin: Yup.string().required('Este campo es obligatorio'),
    cedula: Yup.string(),
    email: Yup.string(),
    phone: Yup.string(),
    members: Yup.string(),
    freeHours: Yup.number(),
    carHours: Yup.number(),
    motoHours: Yup.number()
  });

  const defaultValues = {
    photoUrl: propertyData.photoUrl,
    name: propertyData.name,
    address: propertyData.address,
    nameAdmin: propertyData.nameAdmin,
    cedula: propertyData.cedula,
    email: propertyData.email,
    phone: propertyData.phone,
    members: propertyData.members,
    freeHours: propertyData.freeHours ? propertyData.freeHours : 0,
    carHours: propertyData.carHours,
    motoHours: propertyData.motoHours
  };

  useEffect(() => {
    reset(defaultValues)
  }, [propertyData])

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const accountData = watch()

  const onUpdate = async (data: FormValuesProps) => {
    try {
        let profilePic = null
        // Check if photoUrl is of type CustomFile
        if (data.photoUrl && typeof data.photoUrl !== 'string' && data.photoUrl.preview) {
            const newDocId = uuidv4();
            const storageRef = ref(STORAGE, `${user?.uid}/account/${newDocId}`);

            // Convert the file (from photoUrl) to a blob
            const base64Response = await fetch((data.photoUrl.preview));
            const blob = await base64Response.blob();

            // Upload the blob to Firebase Storage
            const storageSnapshot = await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(storageSnapshot.ref);
            
            data.photoUrl = downloadUrl;
            profilePic= downloadUrl
        }

        // Update user profile data
        if (AUTH.currentUser) {
          await updateProfile(AUTH.currentUser, { displayName: data.name })
          if (!!profilePic) {
           await updateProfile(AUTH.currentUser, { photoURL: profilePic })
          }
        }
        // Update the user data in Firestore
        const docRef = doc(DB, 'users', user?.uid);
        await updateDoc(docRef, data);

        enqueueSnackbar(`Información actualizada`);
        window.location.reload();
    } catch (e) {
        enqueueSnackbar(`Oops error: ${e}`, { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('photoUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // DO NOT ADJUST INDENTATION!
  // This indentation helps it stay aligned somehow lol
  const placeholder = `Juan José Ramírez Corredor - Miembro del consejo - Unidad 4102
Adriana Corredor Vargas - Miembro del consejo - Unidad 1102
Daniel Andres López Parra - Revisor físcal
María Alejandra Daza Arias - Contadora
  `

  return (
    <>
    {/* Header */}
    <Stack sx={{ mb: 2 }}>
      <Typography variant='h4'>Agregar información de la copropiedad</Typography>
      <Typography variant='body2'>Esta información será usada en la generación de documentos con inteligencia artificial.</Typography>
    </Stack>

    {/* Form */}
    <FormProvider methods={methods} onSubmit={handleSubmit(onUpdate)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography textAlign='center' variant='subtitle1' sx={{ mb: 1 }}>Logo de la copropiedad</Typography>
            <Box>
              <RHFUploadAvatar
                name="photoUrl"
                maxSize={3145728}
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
                    Formatos válidos *.jpeg, *.jpg, *.png, *.gif
                    <br />tamaño máximo {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack gap={2}>
                <Typography variant='subtitle1'>Datos de la copropiedad</Typography>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name="name" label="Nombre de la copropiedad" placeholder='Conjunto Los Olivos II'/>
                  <RHFTextField name="address" label="Dirección de la copropiedad" placeholder='Calle 10 # 5-51'/>
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
                  <RHFTextField name="email" label="Email del conjunto" placeholder='conjunto.olivos@gmail.com'/>
                  <RHFTextField name="phone" label="Teléfono " placeholder='6015455555'/>
                </Box>

                <Divider />

                <Typography variant='subtitle1'>Información del consejo</Typography>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name="nameAdmin" label="Nombre completo administrador(a)" placeholder='Lina María López Toro'/>
                  <RHFTextField name="cedula" label="C.C. administrador(a)" placeholder='Cédula de ciudadanía'/>
                </Box>

                <RHFTextField 
                  name="members" 
                  label="Miembros del consejo y proveedores" 
                  placeholder={placeholder}
                  multiline
                  minRows={6}
                  sx={{ p: 0 }}
                />

                <Divider sx={{ my: 1 }}/>
                
                <Typography variant='subtitle1'>Enlace de registro de residentes</Typography>
                <Typography variant='body2'>Envia este link a los copropietarios para que puedan registrarse en Edifia</Typography>
                <CopyBox value={`https://edifia.vercel.app/registro-residentes/?formId=${user?.uid}`} type='text' />

                <Stack gap={2}>
                  <Divider sx={{ my: 1 }}/>

                  <Typography variant='subtitle1'>Costos parqueadero visitantes</Typography>
                  <Typography variant='body2'>Estos valores se usarán para calcular el costo por hora del parqueadero de visitantes a partir del tiempo que haya transcurrido desde que ingresaron a la copropiedad</Typography>
                  <Stack 
                    direction={{xs: 'column', sm: 'row'}} 
                    gap={2} 
                    divider={<Divider orientation="vertical" flexItem />}
                    alignItems='center'
                  >
                    <Stack width='100%' gap={1} alignItems='center'>
                      <Typography fontSize={12} fontWeight={600}>Horas gratuitas</Typography>
                      <IncrementerButton
                        name="freeHours"
                        quantity={accountData.freeHours}
                        onIncrease={() => setValue('freeHours', accountData.freeHours + 1)}
                        onDecrease={() => setValue('freeHours', accountData.freeHours - 1)}
                      />
                      <Typography fontSize={12}  textAlign='center'>Número del de horas gratuitas que tienen los visitantes</Typography>
                    </Stack>
                    
                    <RHFTextField
                      name="carHours"
                      label="Costo por 1 hora carros"
                      placeholder="0"
                      onChange={(event) => setValue('carHours', Number(event.target.value))}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                              $
                            </Box>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                              COP
                            </Box>
                          </InputAdornment>
                        ),
                        type: 'number',
                      }}
                    />

                    <RHFTextField
                      name="motoHours"
                      label="Costo por 1 hora motos"
                      placeholder="0"
                      onChange={(event) => setValue('motoHours', Number(event.target.value))}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                              $
                            </Box>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                              COP
                            </Box>
                          </InputAdornment>
                        ),
                        type: 'number',
                      }}
                    />
                  </Stack>
                </Stack>
            </Stack>
            
            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton 
                type="submit" 
                variant="contained" 
                loading={isSubmitting} 
                startIcon={<Iconify icon='humbleicons:save'/>}
                sx={{ 
                  px: 3, 
                  py: 2, 
                  width: {xs: '100%', sm: 'auto'} 
                }}
              >
                Actualizar información
              </LoadingButton>
            </Stack>
          </Card>

          {!isMobile && <Image
            disabledEffect
            alt="illustration-invite"
            src='/assets/illustrations/residential-complex.png'
            sx={{
              mt: -12,
              left: 15,
              zIndex: 9,
              width: 200,
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
