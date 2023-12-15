import Image from 'src/components/image/Image';
import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import Router from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import { 
  Container,
  Card, 
  Stack, 
  Box, 
  Typography,
  Button,
  Divider
} from '@mui/material';
// firebase
import { setDoc, doc, updateDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField
} from 'src/components/hook-form';
import { IInformeGestion, IGptOutput } from 'src/@types/document';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import GptOutputTextEditor from 'src/components/content-builder/gpt-output-text-editor';
import DocumentTitleHeader from './document-title-header';

// ----------------------------------------------------------------------

type AddEditProps = {
  currentDocument?: IInformeGestion
  gptOutputs?: IGptOutput[]
}

// ----------------------------------------------------------------------

export default function AddEditInformeGestion({ currentDocument, gptOutputs }: AddEditProps) {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const isMobile = useResponsive('down', 'sm')

  const isTablet = useResponsive('down', 'md')

  const schema = Yup.object().shape({
    mes: Yup.string().required('Este campo se obligatorio'),
    gestionAdministrativa: Yup.string().required('Este campo se obligatorio'),
    mantenimientos: Yup.string(),
    cartera: Yup.string(),
    convivencia: Yup.string()
  });

  const defaultValues = useMemo(
    () => ({
      mes: currentDocument?.formValues.mes || '',
      gestionAdministrativa: currentDocument?.formValues.gestionAdministrativa || '',
      mantenimientos: currentDocument?.formValues.mantenimientos || '',
      cartera: currentDocument?.formValues.cartera || '',
      convivencia: currentDocument?.formValues.convivencia || '',
    }),
    [currentDocument?.id]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentDocument) {
      reset(defaultValues);
    }
  }, [currentDocument, defaultValues, reset]);

  const onCreate = handleSubmit(async (data) => {
    const newDocId = uuidv4()
    const payload = {
      id: newDocId,
      inFolder: false,
      project_title: 'Sin título',
      isLoading: true,
      tipo: 'informe-de-gestion',
      dateCreated: new Date(),
      dateModified: new Date(),
      userId: user?.uid,
      formValues: data
    }
    try {
      const docRef = doc(DB, 'users', user?.uid, 'documents', newDocId)
      await setDoc(docRef, payload)
      await axios.post('https://hook.us1.make.com/iuthp7i8ab7i6fp7jeum6qb2em4afnd0', payload)
      Router.push(PATH_DASHBOARD.documentos.view('informe-de-gestion', newDocId))
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    if (currentDocument){
      const payload = {
        userId: user?.uid,
        id: currentDocument.id,
        formValues: data,
        tipo: 'informe-de-gestion'
      }
      try {
        const docRef = doc(DB, 'users', user?.uid, 'documents', currentDocument.id)
        await updateDoc(docRef, { isLoading: true, ...data })
        await axios.post('https://hook.us1.make.com/iuthp7i8ab7i6fp7jeum6qb2em4afnd0', payload)
      } catch (error) {
        enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      }
    }
  });

  // DO NOT ADJUST INDENTATION!
  // This indentation helps it stay aligned somehow lol
  const placeholderGestionAdministrativa = `Describa en detalle los gastos e inversiones realizados, incluyendo pagos de servicios, compras de materiales, contrataciones, entre otros. 
Proporcione cifras y fechas específicas para una comprensión clara de la gestión financiera.

*Ejemplo: "Pago de factura eléctrica de Marzo 2023: $150.000. Compra de pintura para fachada: $500.000 el 10 de Abril 2023.`

const placeholderMantenimientos = `Enumere y describa los mantenimientos realizados durante el período, especificando la naturaleza del trabajo, la fecha de realización y cualquier detalle relevante. 
Incluya mantenimientos a sistemas como el hidráulico, CCTV, puertas, shut de basuras, entre otros.

*Ejemplo: Mantenimiento preventivo del equipo hidráulico el 15 de Febrero 2023. Reparación de cámara de CCTV en entrada principal el 03 de Marzo 2023.`

const placeholderCartera = `Detalle el estado actual de la cartera, incluyendo el total de ingresos recibidos, deudas pendientes, morosidades y cualquier arreglo de pago establecido. 
Proporcione fechas y montos específicos.

*Ejemplo: Total ingresos recibidos Marzo 2023: $2.000.000. Deudas pendientes: 5 unidades, total $1.000.000. Acuerdo de pago con unidad 101, a completar en 6 meses.`

const placeholderConvivencia = `Describa cualquier evento o situación relevante relacionada con la convivencia en el conjunto residencial. 
Incluya detalles sobre quejas, sugerencias, conflictos resueltos, actividades comunitarias, etc.

*Ejemplo: Queja por ruido en unidad 203, resuelta el 20 de Marzo 2023. Actividad de integración comunitaria realizada el 25 de Marzo 2023 con alta participación.`


  const renderHeader = (
    currentDocument 
      ?
        <DocumentTitleHeader 
          currentTitle={currentDocument.project_title} 
          documentId={currentDocument.id}
        />
      :
        <Stack direction='row' gap={2} sx={{ mb: { xs: 2 } }}>
          <Button 
            variant='outlined' 
            color='inherit'
            onClick={() => Router.push(PATH_DASHBOARD.redaccion)}
          >
            <Iconify icon='pajamas:go-back'/>
          </Button>
          <Typography variant='h4'>Redactar informe de gestión ✏️</Typography>
        </Stack>
  )

  const renderProperties = (
    <>
      {!isMobile && <Stack sx={{ width: '100%' }} alignItems='flex-end'>
        <Box sx={{ maxWidth: 180, zIndex: 2, mr: 2, mt: -4 }}>
          <img src='/assets/illustrations/typewriter2.png'/>
        </Box>
      </Stack>}
      <Card sx={{ p: 3, mt: {sm: -15, xs: 2} }}>
        <Stack gap={2}>
            <Stack 
              sx={{ width: {xs: '100%', sm: '80%'} }} 
            >
              <RHFTextField 
                name="mes" 
                label="Mes y año del informe" 
                placeholder='Junio 2023'
              />
            </Stack>

            <Stack 
              direction={{xs: 'column', sm: 'row'}} 
              gap={2} 
            >
              <RHFTextField 
                name="gestionAdministrativa" 
                label="Gestión administrativa" 
                placeholder={placeholderGestionAdministrativa}
                multiline
                minRows={4}
              />

              <RHFTextField 
                name="mantenimientos" 
                label="Mantenimientos realizados" 
                placeholder={placeholderMantenimientos}
                multiline
                minRows={4}
              />
            </Stack>

            <Stack
              direction={{xs: 'column', md: 'row'}} 
              gap={2} 
            >
              {!isTablet && 
                <Stack sx={{ maxWidth: '30%' }}>
                  <Image src='/assets/illustrations/file3.png' alt='informe' width={250} height={250}/>
                  <Typography variant='caption'>
                    Por favor, agrega toda la información relevante para el 
                    informe; no te preocupes por la redacción, tildes o errores gramaticales.
                    La IA se va a encargar de todo eso 😉
                  </Typography>
                </Stack>
              }
              <Stack sx={{ width: {md: '80%', xs: '100%'} }} gap={2}>
                <RHFTextField 
                  name="cartera" 
                  label="Cartera" 
                  placeholder={placeholderCartera}
                  multiline
                  minRows={3}
                />

                <RHFTextField 
                  name="convivencia" 
                  label="Convivencia" 
                  placeholder={placeholderConvivencia}
                  multiline
                  minRows={2}
                />
              </Stack>
            </Stack>

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              fullWidth
            >
              Generar documento
            </LoadingButton>
        </Stack>
      </Card>
    </>
  );

  return (
    <Container maxWidth='lg'>
      {renderHeader}
      <FormProvider methods={methods} onSubmit={!!currentDocument ? onSubmit : onCreate}>
        {renderProperties}
      </FormProvider>

        <Divider sx={{ my: 3 }}/>
        
        {currentDocument && gptOutputs?.map((gptOutput) => (
          gptOutput &&
            <GptOutputTextEditor key={gptOutput.id} outputId={gptOutput.id} defaultValue={gptOutput.outputText} proyectoId={currentDocument?.id}/>
        ))}
    </Container>
  );
}
