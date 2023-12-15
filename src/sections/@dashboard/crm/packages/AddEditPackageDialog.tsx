import { useEffect } from 'react';
import * as Yup from 'yup';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  MenuItem
} from '@mui/material';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
// @types
import { IPackage } from 'src/@types/crm';
// firebase
import { doc, updateDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
//
import { useSnackbar } from "src/components/snackbar";
import { useAuthContext } from 'src/auth/useAuthContext';
import { serverTimestamp } from 'firebase/firestore';
// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  item: IPackage | null | undefined;
}

// ----------------------------------------------------------------------

export default function AddEditPackageDialog({
  open,
  onClose,
  item,
  ...other
}: DialogProps) {

  const hasItemData = !!item;

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  // Yup schema
  const RegisterSchema = Yup.object().shape({
    unit: Yup.string().required('Este campo es obligatorio'),
    tower: Yup.string(),
    type: Yup.string(),
    size: Yup.string()
  });

  // Local state for managing form data
  const defaultValues = {
    photoUrl: item?.photoUrl,
    arrivalDate: item?.arrivalDate,
    pickupDate: item?.pickupDate,
    name: item?.name,
    lastName: item?.lastName,
    unit: item?.unit,
    tower: item?.tower,
    unitId: item?.unitId,
    type: item?.type ? item?.type : 'Paquete',
    size: item?.size,
    notes: item?.notes
  };

  const emptyValues = {
    id: '',
    photoUrl: '',
    arrivalDate: serverTimestamp(),
    pickupDate: null,
    name: '',
    lastName: '',
    unit: '',
    tower: '',
    unitId: '',
    type: 'Paquete',
    size: 'Pequeño',
    notes: ''
  } as IPackage;

  const methods = useForm<IPackage>({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (hasItemData) {
      reset(defaultValues) // Add current item values
    } else {
      reset(emptyValues) // Clean current item values
    }
  }, [item])

  const onEdit = async (data: IPackage) => {

    const currentItemId = item?.id;

    if (currentItemId) {
      const docRef = doc(DB, 'basic-crm', user?.uid, 'packages', currentItemId)

      try {
        await updateDoc(docRef, {
          id: currentItemId,
          photoUrl: data.photoUrl,
          name: data.name ? data.name : '',
          lastName: data.lastName ? data.lastName : '',
          arrivalDate: data.arrivalDate,
          pickupDate: data.pickupDate ? data.pickupDate : '',
          type: data.type,
          unitId: data.unitId,
          unit: data.unit,
          tower: data.tower,
          size: data.size,
          notes: data.notes ? data.notes : ''
        })
      
        enqueueSnackbar('Paquete actualizado')
      } catch (error) {
        enqueueSnackbar(`Oops error ${error}`)
      }
    }

    handleClose()
  };

  const handleClose = () => {
    reset(emptyValues)
    onClose()
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle>Editar paquete</DialogTitle>

      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 2 }}> 
        <FormProvider methods={methods} onSubmit={handleSubmit(onEdit)}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFSelect name="type" label='Tipo de correspondencia'>
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
              <RHFTextField name="tower" label="Torre" placeholder='2'/>
              <RHFTextField name="unit" label="Unidad" placeholder='102'/>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="notes" label="Notas u observaciones" />
            </Stack>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              justifyContent='right'
            >
              <Button
                size="large"
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                Editar paquete
              </Button>

              <Button
                size="large"
                variant="outlined"
                disabled={isSubmitting}
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}