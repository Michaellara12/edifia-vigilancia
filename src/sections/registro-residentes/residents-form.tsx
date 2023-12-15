import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
// @mui
import { 
  Stack, 
  Box, 
  Card, 
  Typography, 
  Avatar, 
  Grid,
  IconButton,
  Chip,
  Tooltip,
  FormHelperText
} from '@mui/material';
// form
import Iconify from 'src/components/iconify/Iconify';
import Image from 'src/components/image/Image';
import AddResidentDialog from './dialogs/add-resident-dialog';
import { useBoolean } from 'src/hooks/useBoolean';
import { v4 as uuidv4 } from 'uuid';
// @types
import { INewResident } from 'src/@types/registro-residentes';

// --------------------------------------------

export default function ResidentsForm() {

  const openDialog = useBoolean(false)

  const { fields, append, remove } = useFieldArray({
    name: 'residents'
  });

  const { control, clearErrors } = useFormContext();

  const handleOpen = () => {
    openDialog.onToggle()
  }

  const onCreate = async (data: INewResident) => {
    append({
      id: uuidv4(),
      photoUrl: '/assets/illustrations/avatars/avatar_1.png',
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      whatsapp: data.whatsapp,
      cedula: data.cedula,
      type: data.type
    });

    // Clear any errors related to the 'residents' field
    clearErrors('residents');
  };

  return (
    <>
    <Controller
      name='residents'
      control={control}
      render={({ fieldState: { error } }) => (
        <>
        <Card sx={{ p: 3, mt: 3 }}>
          <Stack gap={2}>
            <Stack>
              <Typography variant='subtitle1'>Información de los residentes</Typography>
            </Stack>

          <Box 
            sx={{ 
              p: 1, 
              border: (theme) => `dashed 1px ${!!error ? theme.palette.error.light : theme.palette.divider}`,  
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
              },
              ...(!!error && {
                borderColor: 'error.light',
                bgcolor: 'error.lighter',
              }),
            }}
            onClick={handleOpen}
          >
            <Stack direction='row' gap={2} sx={{ width: '100%' }} justifyContent='center' alignItems='center'>
              <Iconify icon='material-symbols:person-add-rounded' sx={{ color: 'text.secondary' }}/>
              <Typography sx={{ color: 'text.secondary' }} variant='subtitle1'>
                Agregar residente
              </Typography>
            </Stack>
            
            <Image
              src='/assets/illustrations/family-mini.png'
              sx={{
                width: 200,
                right: 0,
                height: 200,
                opacity: 0.18,
                position: 'absolute',
              }}
            />
          </Stack>
          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
          </Box>

          
            
          </Stack>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {fields.map((field, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={field.id}>
                <Item data={field} onDelete={() => remove(index)}/>
              </Grid>
            ))}
          </Grid>
        </Card>

        <AddResidentDialog open={openDialog.value} onClose={openDialog.onToggle} onCreate={onCreate} />
      </>
      )}
    />
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
          alt={data.name} 
          sx={{ width: 50, height: 50 }} 
          variant='rounded'
        />
        <Chip label={data.type} size="small"/>
      </Stack>

      <Box
        sx={{
          pl: 2,
          pr: 1,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Typography fontSize={12}>{data.name} {data.lastName}</Typography>
        <Typography fontSize={13} noWrap>{data.cedula}</Typography>
        <Typography fontSize={11} noWrap>{data.email}</Typography>
        <Typography fontSize={12} noWrap>{data.whatsapp}</Typography>
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