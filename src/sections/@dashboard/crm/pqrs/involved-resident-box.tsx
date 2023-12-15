import { useFormContext, Controller, FieldError } from 'react-hook-form';
// @mui
import { 
  Stack, 
  Box, 
  Card, 
  Typography, 
  Avatar, 
  FormHelperText,
  IconButton,
  Tooltip,
} from '@mui/material';
//
import Iconify from 'src/components/iconify/Iconify';
import Image from 'src/components/image/Image';
import AddReportingResidentDialog from './add-reporting-resident-dialog';
import { useBoolean } from 'src/hooks/useBoolean';
import useResponsive from 'src/hooks/useResponsive';
// @types
import { ContactType } from 'src/@types/crm';
//
import { parseUnitId } from 'src/utils/parse-unit-id';

// --------------------------------------------

type RenderAddItemBoxProps = {
  error: FieldError | undefined
}

type ItemProps = {
  data: ContactType
  onDelete: () => void
}

// --------------------------------------------

export default function InvolvedResidentBox() {

  const openDialog = useBoolean(false)

  const isMobile = useResponsive('down', 'sm')

  const { control, setValue, clearErrors } = useFormContext();

  const handleOpen = () => {
    openDialog.onToggle()
  }

  const onDelete = () => {
    setValue('involvedResident', null)
  }

  const onCreate = (data: ContactType) => {
    setValue('involvedResident', data)
    clearErrors('reportingResident');
  }

  const RenderAddItemBox = ({ error }: RenderAddItemBoxProps) => {
    return (
    <>
      <Box sx={{ width: '100%' }}>
          <Box 
            sx={{ 
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
                height: {xs: 100, md: 150},
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
              <Stack direction='column' gap={1} sx={{ width: '100%' }} justifyContent='center' alignItems='center'>
                <Iconify 
                  icon='material-symbols:person-add-rounded' 
                  sx={{ 
                    color: !!error ? 'text.disabled' : 'text.secondary'
                  }}
                />
                <Typography 
                  sx={{ 
                    color: !!error ? 'text.disabled' : 'text.secondary'
                  }} 
                  variant='subtitle1'
                  textAlign='center'
                >
                  Residente infractor o involucrado
                </Typography>
              </Stack>
              
              <Image
                src='/assets/illustrations/involved-resident.png'
                sx={{
                  top: -20,
                  width: 200,
                  left: -20,
                  height: 200,
                  opacity: 0.18,
                  position: 'absolute',
                }}
              />
            </Stack>
          </Box>

          {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
          )}
        </Box>

        <AddReportingResidentDialog 
          open={openDialog.value} 
          onClose={openDialog.onToggle} 
          onCreate={onCreate}
          />
    </>
  )}

  return (
    <>
    <Controller
      name='involvedResident'
      control={control}
      render={({ fieldState: { error }, field }) => (
      <>
        {!!field.value
          ?
            <Item data={field.value} onDelete={onDelete}/>
          :
            <RenderAddItemBox error={error}/>
        }
      </>
      )}
    />
    </>
  );
};

// --------------------------------------

const Item = ({ data, onDelete }: ItemProps) => {
  return (
    <Stack sx={{ width: '100%' }} gap={1}>
      <Typography variant='subtitle2'>Residente infractor o involucrado</Typography>
      <Card
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          border: (theme) => `solid 1px ${theme.palette.divider}`, 
          boxShadow: 'none',
        }}
      >
        <Stack alignItems='center' gap={1}> 
          <Avatar 
            src={data.photoUrl} 
            alt={data.fullName} 
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
          <Typography variant='subtitle1'>{parseUnitId(data.unitId)}</Typography>
          <Typography fontSize={12}>{data.fullName}</Typography>
          <Typography fontSize={12}>{data.type}</Typography>
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
    </Stack>
  )
}