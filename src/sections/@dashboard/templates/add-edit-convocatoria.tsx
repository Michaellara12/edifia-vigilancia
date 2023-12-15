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
  MenuItem, 
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
  RHFSelect,
  RHFTextField
} from 'src/components/hook-form';
import { IConvocatoria, IGptOutput } from 'src/@types/document';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import GptOutputTextEditor from 'src/components/content-builder/gpt-output-text-editor';
import DocumentTitleHeader from './document-title-header';

// ----------------------------------------------------------------------

type AddEditProps = {
  currentDocument?: IConvocatoria
  gptOutputs?: IGptOutput[]
}

// ----------------------------------------------------------------------

export default function AddEditConvocatoria({ currentDocument, gptOutputs }: AddEditProps) {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const isMobile = useResponsive('down', 'sm')

  const schema = Yup.object().shape({
    fecha: Yup.date(),
    tipoConvocatoria: Yup.string(),
    tipoAsistencia: Yup.string(),
    tipoReunion: Yup.string(),
    orden: Yup.string().required('Este campo se obligatorio'),
  });

  const defaultValues = useMemo(
    () => ({
      fecha: currentDocument?.formValues.fecha.toDate() || new Date(),
      tipoConvocatoria: currentDocument?.formValues.tipoConvocatoria || 'Ordinaria',
      tipoAsistencia: currentDocument?.formValues.tipoAsistencia || 'Virtual',
      tipoReunion: currentDocument?.formValues.tipoReunion || 'Reunión de consejo',
      orden: currentDocument?.formValues.orden || '',
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
      tipo: 'convocatoria',
      dateCreated: new Date(),
      dateModified: new Date(),
      userId: user?.uid,
      formValues: data
    }
    try {
      const docRef = doc(DB, 'users', user?.uid, 'documents', newDocId)
      await setDoc(docRef, payload)
      await axios.post('https://hook.us1.make.com/iuthp7i8ab7i6fp7jeum6qb2em4afnd0', payload)
      Router.push(PATH_DASHBOARD.documentos.view('convocatoria', newDocId))
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    if (currentDocument){
      const payload = {
        userId: user?.uid,
        id: currentDocument.id,
        tipo: 'convocatoria',
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
  const placeholderOrder = `1. Llamado a lista y verificación de quórum.
2. Informe del Presidente del Consejo.
3. Discusión incremento en la cuota de administración.
4. Elección de nuevos miembros del consejo.
5. Cierre
`

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
          <Typography variant='h4'>Redactar convocatoria ✏️</Typography>
        </Stack>
  )

  const renderProperties = (
    <>
      {!isMobile && <Stack sx={{ width: '100%' }} alignItems='flex-end'>
        <Box sx={{ maxWidth: {sm: 200, md: 220}, zIndex: 2, mr: 2, mt: -2 }}>
          <img src='/assets/illustrations/file.png'/>
        </Box>
      </Stack>}
      <Card sx={{ p: 3, mt: {sm: -22, xs: 0} }}>
        <Stack gap={2}>
          <Stack 
            direction={{xs: 'column', sm: 'row'}} 
            gap={2} 
            sx={{ width: {xs: '100%', sm: '66%', md: '73%'} }} 
          >
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
                      (params) => <TextField {...params} sx={{ width: {xs: '100%', sm: '66%', md: '73%'} }} 
                        InputProps={{
                        endAdornment: <InputAdornment position="start">
                          <Iconify icon='emojione:spiral-calendar'/>
                        </InputAdornment>,
                    }}/>}
                  />
                )}
            />
            
            <RHFSelect name="tipoReunion" label='Tipo de reunión'>
              <MenuItem
                value="Reunión de consejo"
              >
                Reunión de consejo
              </MenuItem>

              <MenuItem
                value="Asamblea de copropietarios"
              >
                Asamblea de copropietarios
              </MenuItem>
            </RHFSelect>

          </Stack>
            
            <Stack 
              direction={{xs: 'column', sm: 'row'}} 
              gap={2} 
              sx={{ width: {xs: '100%', sm: '66%', md: '73%'} }} 
            >
              <RHFSelect name="tipoConvocatoria" label='Tipo de convocatoria'>
                <MenuItem
                  value="Ordinaria"
                >
                  Ordinaria
                </MenuItem>

                <MenuItem
                  value="Extraordinaria"
                >
                  Extraordinaria
                </MenuItem>
              </RHFSelect>

              <RHFSelect name="tipoAsistencia" label='Tipo de asistencia'>
                <MenuItem
                  value="Virtual"
                >
                  💻 Virtual
                </MenuItem>

                <MenuItem
                  value="Presencial"
                >
                  🧍 Presencial
                </MenuItem>

                <MenuItem
                  value="Mixta"
                >
                  👩‍💻 Mixta (presencial y virtual)
                </MenuItem>
              </RHFSelect>
            </Stack>

            <RHFTextField 
              name="orden" 
              label="Oden del día" 
              placeholder={placeholderOrder}
              multiline
              minRows={4}
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
            <GptOutputTextEditor 
              key={gptOutput.id} 
              outputId={gptOutput.id} // This must start with a letter and not a number, or react-quill will throw an error
              defaultValue={gptOutput.outputText} 
              proyectoId={currentDocument?.id}
            />
        ))}
    </Container>
  );
}
