import { useForm } from 'react-hook-form';
// @mui
import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Stack,
  MenuItem,
  TextField,
  SelectChangeEvent,
  Select
} from '@mui/material';
// @types
import { INewResident } from 'src/@types/registro-residentes';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: INewResident) => void;
}

// ----------------------------------------------------------------------

export default function AddResidentDialog({
  open,
  onClose,
  onCreate
}: DialogProps) {

  const defaultValues = {
    id: '',
    photoUrl: '/assets/illustrations/avatars/avatar_1.png',
    name: '',
    lastName: '',
    email: '',
    whatsapp: '',
    cedula: '',
    type: 'Propietario'
  }

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues
  });

  const handleCreate = (data: INewResident) => {
    onCreate(data)
    handleClose()
  }

  const handleClose = () => {
    reset(defaultValues)
    onClose()
  }

  const handleChange = (event: SelectChangeEvent) => {
    setValue('type', event.target.value as string);
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Agregar residente</DialogTitle>

      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 2 }}> 
        <>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField 
                fullWidth
                label="Nombre(s)" 
                {...register('name', {
                  required: 'Este campo es obligatorio'
                })} 
                error={!!errors.name}
                helperText={errors.name && errors.name.message}
              />
              <TextField 
                fullWidth
                label="Apellido(s)" 
                {...register('lastName', {
                  required: 'Este campo es obligatorio'
                })} 
                error={!!errors.lastName}
                helperText={errors.lastName && errors.lastName.message}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField 
                label="Email" 
                {...register('email', {
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Por favor, introduce un email válido'
                  }
                })} 
                fullWidth
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


            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              justifyContent='right'
            >
              <Button
                size="large"
                type="submit"
                variant="contained"
                onClick={handleSubmit(handleCreate)}
              >
                Agregar residente
              </Button>

              <Button
                size="large"
                variant="outlined"
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