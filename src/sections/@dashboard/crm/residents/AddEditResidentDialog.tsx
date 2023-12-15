import { useEffect } from 'react';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  MenuItem,
  TextField,
  Select,
  SelectChangeEvent
} from '@mui/material';
// form
import { useForm } from 'react-hook-form';
// @types
import { IResident } from 'src/@types/crm';
// firebase
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
//
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from "src/components/snackbar";
import { useAuthContext } from 'src/auth/useAuthContext';
import { getRandomImageUrl } from '../utils/get-random-image-url';
import { cleanTowerUnitValues } from 'src/utils/clean-tower-unit-values';
//
import { IResidentType } from 'src/@types/crm';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  item: IResident | null | undefined;
  isNewItem: boolean;
}

// ----------------------------------------------------------------------

export default function AddEditResidentDialog({
  open,
  onClose,
  item,
  isNewItem,
  ...other
}: DialogProps) {

  const hasItemData = !!item;

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const newProfilePic = getRandomImageUrl();

  // Local state for managing form data
  const defaultValues = {
    type: item?.type,
    photoUrl: !!item?.photoUrl ? item?.photoUrl : newProfilePic,
    name: item?.name,
    lastName: item?.lastName,
    whatsapp: item?.whatsapp,
    email: item?.email,
    company: item?.company,
    cedula: item?.cedula,
    unit: item?.unit,
    tower: item?.tower,
    unitId: item?.unitId
  };

  const emptyValues = {
    type: 'Propietario',
    photoUrl: '/assets/illustrations/avatars/avatar_1.png',
    name: '',
    lastName: '',
    whatsapp: '',
    email: '',
    company: '',
    cedula: '',
    unitId: '',
    tower: '',
    unit: ''
  } as IResident;

  const { 
    watch, 
    register, 
    handleSubmit, 
    reset, setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<IResident>({
    defaultValues
  });

  const residentType = watch('type')

  useEffect(() => {
    if (hasItemData) {
      reset(defaultValues) // Add current item values
    } else {
      reset(emptyValues) // Clean current item values
    }
  }, [item])

  const onEdit = async (data: IResident) => {
    const currentItemId = item?.id;

    if (currentItemId) {
      const docRef = doc(DB, 'crm', user?.uid, 'residents', currentItemId)
      const basicCrmRef = doc(DB, 'basic-crm', user?.uid, 'residents', currentItemId)

      try {
        await updateDoc(docRef, {
          id: currentItemId,
          name: data.name,
          lastName: data.lastName,
          whatsapp: data.whatsapp,
          email: data.email,
          cedula: data.cedula,
          type: data.type,
          unitId: data.unitId,
          unit: data.unit,
          tower: data.tower
        })
        // Update basic-crm file
        await updateDoc(basicCrmRef, {
          id: currentItemId,
          name: data.name,
          lastName: data.lastName,
          type: data.type,
          unitId: data.unitId,
          unit: data.unit,
          tower: data.tower
        })
        enqueueSnackbar('Residente actualizado')
      } catch (error) {
        enqueueSnackbar(`Oops error ${error}`)
      }
    }

    handleClose()
  };

  const onCreate = async (data: IResident) => {
    const [cleanTower, cleanUnit, unitId] = cleanTowerUnitValues(data.tower, data.unit)

    try {
      // Trim and clean values
      data.id = uuidv4()
      data.tower = cleanTower
      data.unit = cleanUnit
      data.unitId = unitId

      if (data.type === 'Inmobiliaria') {
        data.photoUrl = '/assets/illustrations/office-building-mini.png'
      }

      // Check if unit exists
      const unitRef = doc(DB, 'crm', user?.uid, 'units', unitId)
      const unitDoc = await getDoc(unitRef)
      if (!unitDoc.exists()) {
        throw new Error('Esta unidad no existe');
      }

      // Set doc data
      const docRef = doc(DB, 'crm', user?.uid, 'residents', data.id)
      const basicCrmRef = doc(DB, 'basic-crm', user?.uid, 'residents', data.id)
      await setDoc(docRef, {
        ...data
      })

      await setDoc(basicCrmRef, {
        id: data.id,
        photoUrl: data.photoUrl,
        type: data.type,
        unit: data.unit,
        tower: data.tower,
        name: data.name,
        lastName: data.lastName,
        unitId: unitId
      })

      enqueueSnackbar('Nuevo residente agregado')
    } catch (e) {
      enqueueSnackbar(`Oops error: ${e}`, { variant: 'error' })
    }
    handleClose()
  };

  const handleChange = (event: SelectChangeEvent) => {
    setValue('type', event.target.value as IResidentType);
  }

  const handleClose = () => {
    reset(emptyValues)
    onClose()
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle>{!isNewItem ? "Editar residente" : "Agregar residente"}</DialogTitle>

      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 2 }}> 
        <>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField 
                fullWidth
                label="Torre o interior" 
                placeholder='2' 
                disabled={!!item}
                {...register('tower')} 
              />

              <TextField 
                fullWidth
                label="Unidad o apartamento" 
                placeholder='202' 
                disabled={!!item}
                {...register('unit', {
                  required: 'Este campo es obligatorio'
                })}   
                error={!!errors.unit}
                helperText={errors.unit && errors.unit.message}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField 
                fullWidth
                label="Nombre(s)" 
                placeholder='Juan Diego' 
                {...register('name', {
                  required: 'Este campo es obligatorio'
                })} 
                error={!!errors.name}
                helperText={errors.name && errors.name.message}
              />
              <TextField 
                fullWidth
                label="Apellido(s)" 
                placeholder='Rodriguez Toro' 
                {...register('lastName', {
                  required: 'Este campo es obligatorio'
                })} 
                error={!!errors.lastName}
                helperText={errors.lastName && errors.lastName.message}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField 
                fullWidth
                label="Email" 
                placeholder='diago.rodriguez@gmail.com' 
                {...register('email', {
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Agrega un email válido",
                  },
                })}   
                error={!!errors.email}
                helperText={errors.email && errors.email.message}
              />
              <TextField 
                label="Whatsapp" 
                {...register('whatsapp', {
                  pattern: {
                    value: /^57\d{10}$/,
                    message: 'El número de Whatsapp debe comenzar con 57, ej. 573018980000'
                  }
                })} 
                placeholder='573016659871'
                fullWidth
                error={!!errors.whatsapp}
                helperText={errors.whatsapp && errors.whatsapp.message}
              />
              <TextField label="Documento de identidad (Cédula)" {...register('cedula')} fullWidth/>
            </Stack>

            <Select
              defaultValue='Propietario'
              onChange={handleChange}
              fullWidth
            >
              <MenuItem
                value="Propietario"
              >
                Propietario
              </MenuItem>

              <MenuItem
                value="Arrendatario"
              >
                Arrendatario
              </MenuItem>

              <MenuItem
                value="Inmobiliaria"
              >
                Inmobiliaria
              </MenuItem>
            </Select>

            {residentType === 'Inmobiliaria' && 
              <TextField 
                fullWidth
                label="Empresa" 
                placeholder='Inmobiliaria o banco' 
                {...register('company')} 
              />
            }

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              justifyContent='right'
            >
              <Button
                size="large"
                onClick={!isNewItem ? handleSubmit(onEdit) : handleSubmit(onCreate)}
                variant="contained"
                disabled={isSubmitting}
              >
                {!isNewItem ? 'Editar residente' : 'Agregar residente'}
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
        </>
      </DialogContent>
    </Dialog>
  );
}