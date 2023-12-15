import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import Router from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import { 
  Container,
  Card, 
  Stack, 
  TextField, 
  InputAdornment, 
  Box, 
  Typography,
  Button,
  Divider
} from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
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
import { IActaConsejo, IGptOutput } from 'src/@types/document';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import GptOutputTextEditor from 'src/components/content-builder/gpt-output-text-editor';
import DocumentTitleHeader from './document-title-header';

// ----------------------------------------------------------------------

type AddEditProps = {
  currentDocument?: IActaConsejo
  gptOutputs?: IGptOutput[]
}

// ----------------------------------------------------------------------

export default function AddEditActaDeConsejo({ currentDocument, gptOutputs }: AddEditProps) {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const isMobile = useResponsive('down', 'sm')

  const schema = Yup.object().shape({
    fecha: Yup.date(),
    fechaCierre: Yup.date(),
    orden: Yup.string().required('Este campo se obligatorio'),
    asistentes: Yup.string(),
    numeroActa: Yup.string(),
    puntosVarios: Yup.string().required('Este campo se obligatorio')
  });

  const defaultValues = useMemo(
    () => ({
      fecha: currentDocument?.formValues.fecha.toDate() || new Date(),
      fechaCierre: currentDocument?.formValues.fechaCierre.toDate() || new Date(),
      orden: currentDocument?.formValues.orden || '',
      asistentes: currentDocument?.formValues.asistentes || '',
      numeroActa: currentDocument?.formValues.numeroActa || '',
      puntosVarios: currentDocument?.formValues.puntosVarios || '',
    }),
    [currentDocument?.id]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    control,
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
      tipo: 'acta-de-consejo',
      dateCreated: new Date(),
      dateModified: new Date(),
      userId: user?.uid,
      formValues: data
    }
    try {
      const docRef = doc(DB, 'users', user?.uid, 'documents', newDocId)
      await setDoc(docRef, payload)
      await axios.post('https://hook.us1.make.com/iuthp7i8ab7i6fp7jeum6qb2em4afnd0', payload)
      Router.push(PATH_DASHBOARD.documentos.view('acta-de-consejo', newDocId))
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    if (currentDocument){
      const payload = {
        userId: user?.uid,
        id: currentDocument.id,
        tipo: 'acta-de-consejo',
        formValues: data
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
  const placeholderAssitants = `Juan José Ramírez Corredor - Miembro del consejo - Unidad 4102
Adriana Corredor Vargas - Residente - Unidad 1102
Daniel Andres López Parra - Revisor físcal
María Alejandra Daza Arias - Contadora
`

  const placeholderOrder = `1. Llamado a lista y verificación de quórum.
2. Informe del Presidente del Consejo.
3. Discusión incremento en la cuota de administración.
5. Cierre
`
  const placeholderPuntosVarios = `Mantenimiento y Reparaciones:
Revisión de las labores de mantenimiento realizadas en el último mes, incluyendo limpieza de áreas comunes y reparaciones menores.
Aprobación de la propuesta para la reparación del sistema de iluminación en el parqueadero.
Discusión sobre la necesidad de pintar la fachada del edificio.
Gestión Administrativa:
Informe de la gestión administrativa realizada por la empresa encargada de la administración del conjunto.
Evaluación del desempeño del personal de seguridad y limpieza.
Propuestas para mejorar la comunicación entre la administración y los residentes.
Estados Financieros:
Presentación del estado financiero actual del conjunto residencial.
Detalle de ingresos por cuotas de administración y otros ingresos.
Análisis de gastos mensuales y propuestas para optimizar recursos.
`

  const helperTextPuntosVarios = `Por favor, agrega toda la información relevante para el acta; no te preocupes por la redacción, tildes o errores gramaticales. La IA se va a encargar de todo eso 😉`

  const renderHeader = (
    currentDocument 
      ?
        <DocumentTitleHeader 
          currentTitle={currentDocument.project_title} 
          documentId={currentDocument.id}
        />
      :
        <Stack direction='row' gap={2} sx={{ mb: { xs: 2, sm: -1 } }}>
          <Button 
            variant='outlined' 
            color='inherit'
            onClick={() => Router.push(PATH_DASHBOARD.redaccion)}
          >
            <Iconify icon='pajamas:go-back'/>
          </Button>
          <Typography variant='h4'>Redactar acta de consejo ✏️</Typography>
        </Stack>
  )

  const renderProperties = (
    <>
      {!isMobile && <Stack sx={{ width: '100%' }} alignItems='flex-start'>
        <Box 
          sx={{ 
            maxWidth: {sm: 100, md: 120}, 
            zIndex: 2, 
            p: 1 
          }}>
            <img src='/assets/illustrations/file2.png'/>
        </Box>
      </Stack>}
      <Card sx={{ p: 3, mt: {sm: -12, xs: 0} }}>
        <Stack gap={2}>
            <Stack 
              direction={{xs: 'column', sm: 'row'}} 
              gap={2} 
              sx={{ 
                width: {xs: '100%', sm: '83%', md: '87%'},
                alignSelf: 'flex-end'
              }} 
            >
              <RHFTextField 
                name="numeroActa" 
                label="Número de Acta" 
                placeholder='0012'
              />

              <Controller
                name="fecha"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    {...field}
                    onChange={(newValue: Date | null) => field.onChange(newValue)}
                    label="Fecha de la reunión"
                    inputFormat="dd/MM/yyyy hh:mm a"
                    renderInput={
                      (params) => <TextField {...params} sx={{ width: '100%' }}
                        InputProps={{
                        endAdornment: <InputAdornment position="start">
                          <Iconify icon='emojione:spiral-calendar'/>
                        </InputAdornment>,
                    }}/>}
                  />
                )}
              />

              <Controller
                name="fechaCierre"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    {...field}
                    onChange={(newValue: Date | null) => field.onChange(newValue)}
                    label="Hora de cierre"
                    inputFormat="dd/MM/yyyy hh:mm a"
                    renderInput={
                      (params) => <TextField {...params} sx={{ width: '100%' }}
                        InputProps={{
                        endAdornment: <InputAdornment position="start">
                          <Iconify icon='emojione:spiral-calendar'/>
                        </InputAdornment>,
                    }}/>}
                  />
                )}
              />
            </Stack>

            <Stack
              direction={{xs: 'column', sm: 'row'}} 
              gap={2} 
            >
              <RHFTextField 
                name="orden" 
                label="Oden del día" 
                placeholder={placeholderOrder}
                multiline
                minRows={4}
              />

              <RHFTextField 
                name="asistentes" 
                label="Asistentes o invitados a la reunión" 
                placeholder={placeholderAssitants}
                multiline
                minRows={4}
              />
            </Stack>

            <RHFTextField 
              name="puntosVarios" 
              label="Información relevante" 
              placeholder={placeholderPuntosVarios}
              multiline
              minRows={4}
              helperText={helperTextPuntosVarios}
            />

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
    <Container maxWidth='md'>
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
