import { useState, useEffect } from 'react';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  MenuItem,
  Avatar,
  Typography,
  Skeleton,
  TextField,
  SelectChangeEvent,
  Select
} from '@mui/material';
// form
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// utils
import useFetchResidents from '../utils/use-fetch-residents';
import { ContactType } from 'src/@types/crm';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: ContactType) => void;
}

type FormValuesType = {
  residentId: string
  tower?: string
  unit: string
};

// ----------------------------------------------------------------------

export default function AddReportingResidentDialog({
  open,
  onClose,
  onCreate,
  ...other
}: DialogProps) {

  const [unitId, setUnitId] = useState('')

  // Yup schema
  const RegisterSchema = Yup.object().shape({
    tower: Yup.string(),
    unit: Yup.string().required('Este campo es obligatorio'),
    residentId: Yup.string().required('Este campo es obligatorio'),
  });

  const defaultValues = {
    residentId: '',
    tower: '',
    unit: ''
  }

  const { 
    register, 
    watch,
    handleSubmit, 
    setValue, 
    reset, 
    formState: { isSubmitting, errors }
   } = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  });

  const tower = watch("tower");
  const unit = watch("unit");

  useEffect(() => {
    if (!!unit) {
      setUnitId(`${tower}${unit}`)
    }
  }, [unit, tower])

  const { residents } = useFetchResidents(unitId)

  const handleChange = (event: SelectChangeEvent) => {
    setValue('residentId', event.target.value as string);
  }

  const handleClose = () => {
    reset(defaultValues)
    onClose()
  }

  const handleCreate = async (data: FormValuesType) => {
    const residentData = residents.find(resident => resident.id === data.residentId)
    if (residentData) {
      onCreate(residentData)
    }
    handleClose()
  };
  
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
      <DialogTitle>Seleccionar residente</DialogTitle>
      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 3 }}> 
          <Stack 
            direction={{xs: 'column', sm:'row' }}
            gap={1} 
            width='100%' 
            alignItems='center' 
            justifyContent='center'
            sx={{ mb: 1, mt: 1 }}
          >
            <Stack gap={2} width='100%'>
              <Stack direction='row' gap={2}>
                <TextField 
                  fullWidth 
                  label="Torre" 
                  {...register('tower')} 
                />

                <TextField 
                  fullWidth 
                  label="Unidad" 
                  {...register('unit', {
                    required: 'Este campo es obligatorio'
                  })} 
                  error={!!errors.unit}
                  helperText={errors.unit && errors.unit.message}
                />
              </Stack>
              {/* resident selector */}
                <Typography variant='subtitle1' sx={{ mb: -2 }}>Selecciona un residente</Typography>
                <Select
                  onChange={handleChange}
                  fullWidth
                  native={false}
                  defaultValue=''
                  error={!!errors.residentId}
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
                </Select> 
                {errors.residentId && <Typography variant='caption' color='error' sx={{ mt: -1 }}>{errors.residentId.message}</Typography>}

              <Stack spacing={2.5}>
                <Stack gap={2}>
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={handleSubmit(handleCreate)}
                  >
                    Agregar residente
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
            </Stack>
          </Stack>
      </DialogContent>
    </Dialog>
  );
}