import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  Select,
  Box
} from '@mui/material';
//
import { UploadAvatar } from 'src/components/upload';
// @types
import { INewMascot } from 'src/@types/registro-residentes';

// ----------------------------------------------------------------------

type DialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: INewMascot) => void;
}

// ----------------------------------------------------------------------

export default function AddMascotDialog({
  open,
  onClose,
  onCreate
}: DialogProps) {

  const defaultValues = {
    id: '',
    photoUrl: '',
    name: '',
    type: 'Perro',
    color: '',
    race: ''
  }

  const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm<INewMascot>({
    defaultValues
  });

  const handleCreate = (data: INewMascot) => {
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

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Agregar mascotas</DialogTitle>

      {/* Form */}
      <DialogContent sx={{ typography: 'body2', mb: 2 }}> 
        <>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Stack 
              direction={{xs: 'column', sm: 'row'}} 
              gap={2} 
              alignItems='center'
            >
              <Box>
                <Controller
                  name='photoUrl'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <UploadAvatar
                        accept={{
                          'image/*': [],
                        }}
                        error={!!error}
                        file={field.value}
                        onDrop={handleDrop}
                      />
                    </div>
                  )}
                />
              </Box>
              <Stack sx={{ width: '100%' }} gap={2}>
                <Stack
                    direction={{xs: 'column', sm: 'row'}} 
                    gap={2} 
                >
                    <Select 
                      defaultValue='Perro'
                      fullWidth 
                      onChange={handleChange}
                    >
                        <MenuItem
                          value="Perro"
                        >
                          🐶 Perro
                        </MenuItem>

                        <MenuItem
                        value="Gato"
                        >
                          🐱 Gato
                        </MenuItem>
                    </Select>

                    <TextField 
                        label="Nombre" 
                        placeholder='Toby'
                        fullWidth
                        {...register('name', {
                          required: 'Este campo es obligatorio'
                        })} 
                        error={!!errors.name}
                        helperText={errors.name && errors.name.message}
                    />
                </Stack>
                <Stack
                    direction={{xs: 'column', sm: 'row'}} 
                    gap={2} 
                >
                    <TextField 
                        label="Color" 
                        placeholder='Negro'
                        fullWidth
                        {...register('color', {
                          required: 'Este campo es obligatorio'
                        })} 
                        error={!!errors.color}
                        helperText={errors.color && errors.color.message}
                    />

                    <TextField 
                        label="Raza" 
                        placeholder='Labrador'
                        fullWidth
                        {...register('race')}
                    />
                </Stack>
              </Stack>
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
                onClick={handleSubmit(handleCreate)}
              >
                Agregar mascota
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