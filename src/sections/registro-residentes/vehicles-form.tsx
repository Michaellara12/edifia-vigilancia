import { useFieldArray } from 'react-hook-form';
// @mui
import { 
  Stack, 
  Box, 
  Card, 
  Typography, 
  Avatar, 
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
// form
import Iconify from 'src/components/iconify/Iconify';
import Image from 'src/components/image/Image';
import AddVehicleDialog from './dialogs/add-vehicle-dialog';
import { useBoolean } from 'src/hooks/useBoolean';
import useResponsive from 'src/hooks/useResponsive';
import { v4 as uuidv4 } from 'uuid';
// @types
import { INewVehicle } from 'src/@types/registro-residentes';

// --------------------------------------------

export default function VehiclesForm() {

  const openDialog = useBoolean(false)

  const isMobile = useResponsive('down', 'sm')

  const { fields, append, remove } = useFieldArray({
    name: 'vehicles'
  });

  const handleOpen = () => {
    openDialog.onToggle()
  }

  const onCreate = async (data: INewVehicle) => {
    // Get the photoUrl based on type or image added
    const getPhotoUrl = () => {
      if (data.photoUrl && typeof data.photoUrl !== 'string' && data.photoUrl.preview) {
        return data.photoUrl.preview // get preview in case image uploaded
      } else if (data.type === 'Moto') {
        return '/assets/illustrations/motorbike.png'
      } else if (data.type === 'Bicicleta') {
        return '/assets/illustrations/bike.png'
      } else {
        return '/assets/illustrations/car.png'
      }
    }

    append({
      id: uuidv4(),
      photoUrl: getPhotoUrl(),
      type: data.type,
      color: data.color,
      brand: data.brand,
      licensePlate: data.licensePlate,
      token: data.token
    });
  };

  return (
    <>
        <Card sx={{ p: 3, mt: 3, width: '100%' }}>
          <Stack gap={2}>
            <Stack>
              <Typography variant='subtitle1'>Información de los vehículos</Typography>
              <Typography variant='body2'>Por favor registra los vehículos de la copropiedad, incluyendo autos, motos y bicicletas, para la gestión de acceso vehicular y parqueaderos.</Typography>
            </Stack>

          <Box 
            sx={{ 
              p: 1, 
              border: (theme) => `dashed 1px ${theme.palette.divider}`,  
              borderRadius: 2.4 
            }}
          >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              p: 3,
              borderRadius: 1.8,
              overflow: 'hidden',
              position: 'relative',
              color: 'common.white',
              bgcolor: `action.disabledBackground`,
              height: 100,
              '&:hover': {
                opacity: 0.72,
                cursor: 'pointer'
              }
            }}
            onClick={handleOpen}
          >
            <Stack direction='row' gap={2} sx={{ width: '100%' }} justifyContent='center' alignItems='center'>
              <Iconify icon='material-symbols:person-add-rounded' sx={{ color: 'text.secondary' }}/>
              <Typography sx={{ color: 'text.secondary' }} variant='subtitle1'>
                Agregar vehículo
              </Typography>
            </Stack>
            
            <Image
              src='/assets/illustrations/car-mini2.png'
              sx={{
                top: -20,
                width: 160,
                right: -20,
                height: 160,
                opacity: 0.18,
                position: 'absolute',
              }}
            />

            {!isMobile && <Image
              src='/assets/illustrations/moto-mini.png'
              sx={{
                top: -20,
                width: 160,
                left: -20,
                height: 160,
                opacity: 0.18,
                position: 'absolute',
              }}
            />}
          </Stack>
          </Box>
          </Stack>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {fields.map((field, index) => (
              <Grid item xs={12} sm={6} md={6} key={field.id}>
                <Item data={field} onDelete={() => remove(index)}/>
              </Grid>
            ))}
          </Grid>
        </Card>

        <AddVehicleDialog open={openDialog.value} onClose={openDialog.onToggle} onCreate={onCreate} />
      </>
  );
};

// --------------------------------------

type ItemProps = {
  data: any
  onDelete: () => void
}

const Item = ({ data, onDelete }: ItemProps) => {

  return (
    <>
    <Card
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        border: (theme) => `solid 1px ${theme.palette.divider}`, 
        boxShadow: 'none' 
      }}
    >
      <Stack alignItems='center' gap={1}> 
        <Avatar 
          src={data.photoUrl} 
          alt={data.type} 
          sx={{ width: 70, height: 70 }} 
          variant='rounded'
        />
      </Stack>

      <Box
        sx={{
          pl: 2,
          pr: 1,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Typography fontSize={11} noWrap>{data.brand}</Typography>
        <Typography fontSize={12}>{data.color}</Typography>
        <Typography fontSize={12} noWrap>{data.licensePlate}</Typography>
        <Typography fontSize={12} noWrap>{data.token}</Typography>
      </Box>

      <Tooltip title="Eliminar">
        <IconButton
          size="small"
          color='error'
          sx={{ flexShrink: 0 }}
          onClick={onDelete}
        >
          <Iconify icon="tabler:trash" />
        </IconButton>
      </Tooltip>
    </Card>
    </>
  )
}