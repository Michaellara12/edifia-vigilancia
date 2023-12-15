import { useEffect } from 'react';
import * as Yup from 'yup';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  MenuItem,
} from '@mui/material';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
// @types
import { IUnit } from 'src/@types/crm';
// firebase
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
//
import { useSnackbar } from "src/components/snackbar";
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  item: IUnit | null | undefined;
}

// ----------------------------------------------------------------------

export default function AddEditUnitDialog({
  open,
  onClose,
  item,
  ...other
}: DialogProps) {

  const hasItemData = !!item;

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const casaPhotoUrl = '/assets/illustrations/casa.png'
  const aptoPhotoUrl = '/assets/illustrations/apto.png'

  // Yup schema
  const RegisterSchema = Yup.object().shape({
    coef: Yup.string().required('Este campo es obligatorio'),
    tower: Yup.string(),
    unit: Yup.string().required('Este campo es obligatorio'),
    type: Yup.string().required('Este campo es obligatorio'),
    parkingLot: Yup.string(),
    secondParkingLot: Yup.string(),
    deposit: Yup.string(),
    secondDeposit: Yup.string(),
  });

  const defaultValues = {
    coef: item?.coef,
    type: item?.type,
    tower: item?.tower,
    unit: item?.unit,
    parkingLot: item?.parkingLot,
    secondParkingLot: item?.secondParkingLot,
    deposit: item?.deposit,
    secondDeposit: item?.secondDeposit
  };

  // Clean current dialog values
  const resetValues = {
    coef: '',
    type: 'Apartamento',
    tower: '',
    unit: '',
    parkingLot: '',
    secondParkingLot: '',
    deposit: '',
    secondDeposit: ''
  } as IUnit;

  const methods = useForm<IUnit>({
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
      reset(resetValues) // Clean current item values
    }
  }, [item])

  const handleClose = () => {
    reset(resetValues)
    onClose()
  }

  const onCreate = async (data: IUnit) => {
    const newDocId = !!data.tower ? `${data.tower}${data.unit}` : data.unit
    const parkingLot = !!data.parkingLot ? data.parkingLot : ''
    const secondParkingLot = !!data.secondParkingLot ? data.secondParkingLot : ''
    const deposit = !!data.deposit ? data.deposit : ''
    const secondDeposit = !!data.secondDeposit ? data.secondDeposit : ''
    try {
      const docRef = doc(DB, 'crm', user?.uid, 'units', newDocId)
      const basicCrmRef = doc(DB, 'basic-crm', user?.uid, 'units', newDocId)

      await setDoc(docRef, {
        id: newDocId,
        photoUrl: data.type === 'Apartamento' ? aptoPhotoUrl : casaPhotoUrl,
        coef: data.coef,
        type: data.type,
        tower: data.tower,
        unit: data.unit,
        parkingLot: parkingLot,
        secondParkingLot: secondParkingLot,
        deposit: deposit,
        secondDeposit: secondDeposit,
        mascots: [],
      })
      
      await setDoc(basicCrmRef, {
        id: newDocId,
        photoUrl: data.type === 'Apartamento' ? aptoPhotoUrl : casaPhotoUrl,
        tower: data.tower,
        unit: data.unit,
      })
      enqueueSnackbar('Nueva unidad agregada')
    } catch (e) {
      enqueueSnackbar('No fue posible agregar esta unidad', { variant: 'error' })
    }
    handleClose()
  };

  const onEdit = async (data: IUnit) => {

    const currentItemId = item?.id;

    if (currentItemId) {
      const docRef = doc(DB, 'crm', user?.uid, 'units', currentItemId)
      const docData = await getDoc(docRef)
      try {
        await updateDoc(docRef, {
          id: currentItemId,
          photoUrl: data.type === 'Apartamento' ? aptoPhotoUrl : casaPhotoUrl,
          coef: data.coef,
          type: data.type,
          tower: data.tower,
          unit: data.unit,
          parkingLot: data.parkingLot,
          secondParkingLot: data.secondParkingLot,
          deposit: data.deposit,
          secondDeposit: data.secondDeposit,
          mascots: docData.data()?.mascots,
        })
        enqueueSnackbar('Unidad actualizada')
      } catch (error) {
        enqueueSnackbar(`Oops error ${error}`)
      }
    }
    handleClose()
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle>{hasItemData ? "Editar unidad" : "Agregar unidad"}</DialogTitle>

      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 2 }}> 
        <FormProvider methods={methods} onSubmit={hasItemData ? handleSubmit(onEdit) : handleSubmit(onCreate)}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFSelect name="type">
                <MenuItem
                  value="Apartamento"
                >
                  🏬 Apartamento
                </MenuItem>

                <MenuItem
                  value="Casa"
                >
                  🏡 Casa
                </MenuItem>
              </RHFSelect>

              <RHFTextField 
                name="tower" 
                label="Torre / Bloque / Manzana" 
              />

              <RHFTextField
                name="unit"
                label="Unidad"
              />

              <RHFTextField
                name="coef"
                label="Coeficiente"
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField 
                name="parkingLot" 
                label="Parqueadero No. 1" 
              />

              <RHFTextField 
                name="secondParkingLot" 
                label="Parqueadero No. 2" 
              />

              <RHFTextField
                name="deposit"
                label="Depósito No. 1"
              />

              <RHFTextField
                name="secondDeposit"
                label="Depósito No. 2"
              />
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
                {hasItemData ? 'Editar unidad' : 'Agregar unidad'}
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