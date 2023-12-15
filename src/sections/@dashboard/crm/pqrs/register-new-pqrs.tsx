import { useState, useEffect, useCallback } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, {
  RHFUpload,
  RHFTextField,
  RHFSelect
} from 'src/components/hook-form';
import { CustomFile } from 'src/components/upload';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, useTheme, Button, MenuItem, Divider } from '@mui/material';
// firebase
import { useAuthContext } from 'src/auth/useAuthContext';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { DB, STORAGE } from 'src/auth/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// components
import { useSnackbar } from 'src/components/snackbar';
import { v4 as uuidv4 } from 'uuid';
import Iconify from 'src/components/iconify/Iconify';
import Image from 'src/components/image/Image';
import useResponsive from 'src/hooks/useResponsive';
import { IAuthResident } from 'src/@types/crm';
import ReportingResidentBox from './reporting-resident-box';
import InvolvedResidentBox from './involved-resident-box';
//
import pqrsSchema from './pqrs-schema';

// ----------------------------------------------------------------------

type FormValues = {
  motive: string
  type: string
  description: string
  files: (string | (File & { preview: string; }))[]
  reportingResident: null | IAuthResident
  accusedResident: null | IAuthResident
}

export default function RegisterNewPqrs() {
  const { push } = useRouter();

  const theme = useTheme();

  const { user } = useAuthContext();

  const isMobile = useResponsive('down', 'sm')

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    motive: '',
    type: 'Queja',
    description: '',
    files: [],
    reportingResident: null,
    accusedResident: null
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(pqrsSchema),
    defaultValues
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.files || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('files', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.files]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.files && values.files?.filter((file) => file !== inputFile);
      setValue('files', filtered);
    },
    [setValue, values.files]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('files', []);
  }, [setValue]);

  const onCreate = async (data: FormValues) => {
    try {
      console.log('created')
    } catch (e) {
      enqueueSnackbar(`Oops error: ${e}`, { variant: 'error' });
    }
  };

  const handleReturnButton = () => {
    push(PATH_DASHBOARD.pqrs.root);
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
      <Typography variant='h4'>Registrar PQRS (Petición, Queja, Reclamo o Solicitud)</Typography>
    </Stack>

    {/* Form */}
    <FormProvider methods={methods} onSubmit={handleSubmit(onCreate)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack gap={2}>
              <RHFTextField name="motive" label="Motivo" placeholder='La mascota ladra y hace mucho ruido en la madrugada' />
              <RHFSelect name="type" label='Tipo de PQRS'>
                <MenuItem value="Peticion">
                  Petición
                </MenuItem>
                <MenuItem value="Queja">
                  Queja
                </MenuItem>
                <MenuItem value="Reclamo">
                  Reclamo
                </MenuItem>
                <MenuItem value="Solicitud">
                  Solicitud
                </MenuItem>
              </RHFSelect>
              <RHFTextField 
                name="description" 
                label="Descripción" 
                placeholder='El residente reporta que en la torre 17 apto 102 la mascota ladra desde la madrugada y no deja a los demás copropietarios descansar en paz.'
                multiline
                rows={3}
              />
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Archivos relacionados con PQRS</Typography>
                <RHFUpload
                  multiple
                  thumbnail
                  name="files"
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => console.info('ON UPLOAD')}
                />
              </Stack>

              <Stack>
                <Typography variant="subtitle2">Residentes involucrados</Typography>
                <Typography variant="body2">Agregar el residente que instaura o reporta el PQRS y (opcional) el residente que esta involucrado</Typography>
              </Stack>
              <Stack 
                direction={{ xs: 'column', md: 'row' }}
                divider={<Divider orientation='vertical' flexItem sx={{ mx: 1.5 }} />}
              >
                <ReportingResidentBox />
                <InvolvedResidentBox />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack alignItems='center'>
            <Image
              disabledEffect
              alt="illustration-invite"
              src='/assets/illustrations/pqrs.png'
              sx={{
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.1))',
                zIndex: 2,
                mt: -5,
                maxWidth: 280,
                maxHeight: 280
              }}
            />
          </Stack>
          <Card sx={{ pt: 13, pb: 2, px: 2, mt: -14 }}>
            <Typography variant='body2' sx={{ zIndex: 3 }}>Una vez ingresados todos los detalles, confirma el registro del PQRS. </Typography>
            <LoadingButton 
              fullWidth
              type="submit" 
              variant="contained" 
              loading={isSubmitting} 
              startIcon={<Iconify icon='bx:edit'/>}
              sx={{ 
                px: 3, 
                py: 2, 
                boxShadow: theme.customShadows.primary,
                mt: 1
              }}
            >
              Agregar PQRS
            </LoadingButton>
          </Card>
          
        </Grid>
      </Grid>
    </FormProvider>
    </>
  );
}
