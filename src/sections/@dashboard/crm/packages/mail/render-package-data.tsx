import { 
  Stack, 
  Typography, 
} from '@mui/material';
import Label from 'src/components/label/Label';
import Iconify from 'src/components/iconify/Iconify';
// utils
import { fDateTime } from 'src/utils/formatTime';
// @types
import { IPackage } from 'src/@types/crm';

// ---------------------------------------------------------------

type Props = {
  packageData: IPackage
}

export const RenderPackageData = ({ packageData }: Props) => {
  const isPaquete = packageData?.type === 'Paquete'

  const unit = !!packageData?.tower ? `Torre ${packageData?.tower} Apto. ${packageData?.unit}` : `Casa ${packageData?.unit}`

  const arrivalDate = !!packageData?.arrivalDate && fDateTime(packageData.arrivalDate)

  const notes = !!packageData?.notes ? packageData.notes : ''

  return (
    <Stack gap={1}>
      <Label 
        color='info' 
        sx={{ maxWidth: 90 }}
        startIcon={
          <Iconify 
            icon={isPaquete ? 'solar:box-outline' : 'uil:envelope'}
          />
        }
      >
        {isPaquete ? 'Paquete' : 'Sobre'}
      </Label>
      <Typography variant='h4'>{unit}</Typography>
      <Typography variant='body2'>{arrivalDate}</Typography>
      <Stack gap={1}>
        <Typography variant='subtitle2'>Notas u observaciones: {notes}</Typography>
        <Typography variant='body2'>{notes}</Typography>
      </Stack>
    </Stack>
  )
}