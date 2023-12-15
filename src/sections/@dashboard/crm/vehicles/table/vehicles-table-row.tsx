// @mui
import {
  TableRow,
  TableCell,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
// @types
import { IUnitVehicle, ILastActivityVehicle } from 'src/@types/crm';
// components
import AuthEntryExitVehicle from '../auth-entry-exit-vehicle';
//
import { useBoolean } from 'src/hooks/useBoolean';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import { fDateTime } from 'src/utils/formatTime';
import { StyledTypography } from '../../styles';

// ----------------------------------------------------------------------

type Props = {
  row: IUnitVehicle;
};

export default function VehiclesTableRow({
  row,
}: Props) {

  // Row columns
  const { 
    type,
    brand,
    color,
    licensePlate,
    token,
    photoUrl,
    unitId,
    lastActivity
  } = row;

  const openAuthDialog = useBoolean();

  type LabelColor = 'success' | 'info' | 'primary'

  const renderAuthAction = (lastActivity: ILastActivityVehicle) => {
    let color: LabelColor = 'success';
    let icon = 'uil:entry';
  
    if (lastActivity.authAction === 'Registro') {
      color = 'primary'; // Change the color for 'Registro'
      icon = 'gg:check-o'; // Replace with your actual icon for 'Registro'
    } else if (lastActivity.authAction === 'Salida') {
      color = 'info'; // Change the color for 'Salida'
      icon = 'iconamoon:exit'; // Replace with your actual icon for 'Salida'
    }
  
    return (
      <Stack gap={1} alignItems='left'>
        <Label
          color={color}
          sx={{ maxWidth: 90, py: 2 }}
          startIcon={<Iconify icon={icon} />}
        >
          {lastActivity.authAction}
        </Label>
        {fDateTime(lastActivity.timestamp)}
      </Stack>
    );
  };

  return (
    <>
      <TableRow 
        hover 
        onClick={openAuthDialog.onToggle} 
        sx={{ '&:hover': {cursor: 'pointer'} }}
      >
        <TableCell>
          <Stack direction='row' gap={2} alignItems='center'>
            <Avatar 
              src={photoUrl} 
              alt={unitId}  
              variant="rounded" 
              sx={{ width: 56, height: 56 }}
            />
            <Stack>
              <StyledTypography variant='subtitle2'>
                {type}
              </StyledTypography>

              <StyledTypography variant='body2'>
                {type === 'Bicicleta' ? token : licensePlate}
              </StyledTypography>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {color}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {brand}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {unitId}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {renderAuthAction(lastActivity)}
          </StyledTypography>
        </TableCell>
      </TableRow>

      <AuthEntryExitVehicle 
        open={openAuthDialog.value} 
        onClose={openAuthDialog.onToggle}
        item={row}
      />
    </>
  );
}
