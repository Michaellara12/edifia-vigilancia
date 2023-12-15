// @mui
import {
  TableRow,
  TableCell,
  Avatar,
  Stack,
} from '@mui/material';
// @types
import { IDelivery } from 'src/@types/crm';
// components
import AuthExitDelivery from '../auth-exit-delivery';
//
import { useBoolean } from 'src/hooks/useBoolean';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import { fDateTime } from 'src/utils/formatTime';
import { StyledTypography } from '../../styles';

// ----------------------------------------------------------------------

type Props = {
  row: IDelivery;
};

export default function DeliveriesTableRow({
  row,
}: Props) {

  // Row columns
  const { 
    photoUrl,
    unitId,
    authResident,
    arrivalDate,
    exitDate,
    notes
  } = row;

  const openAuthDialog = useBoolean();

  const handleOpenAuthExit = () => {
    if (!!exitDate) {
      return
    }
    openAuthDialog.onToggle();
  }

  return (
    <>
      <TableRow 
        hover 
        onClick={handleOpenAuthExit} 
        sx={{ '&:hover': {cursor: 'pointer'} }}
      >
        <TableCell>
          <StyledTypography variant='body2'>
            {unitId}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <Stack direction='row' gap={2} alignItems='center'>
            <Avatar 
              src={authResident?.photoUrl} 
              alt={unitId}  
            />
            <Stack>
              <StyledTypography variant='subtitle2'>
                {authResident?.type}
              </StyledTypography>

              <StyledTypography variant='body2'>
                {authResident?.fullName}
              </StyledTypography>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
        <Stack direction='row' gap={2}  alignItems='center'>
          <Avatar src={photoUrl} alt='delivery' />
          {!!exitDate
            ?
              <Stack>
                <Label 
                  startIcon={<Iconify icon='iconamoon:enter'/>}
                  color='success'   
                  sx={{ maxWidth: 90 }}           
                >
                  Ingreso:
                </Label>
                <StyledTypography variant='body2'>{fDateTime(arrivalDate)}</StyledTypography>
                <Label 
                  startIcon={<Iconify icon='mingcute:exit-line'/>}
                  color='error'   
                  sx={{ maxWidth: 90 }}           
                >
                  Salida:
                </Label>
                <StyledTypography variant='body2'>{fDateTime(exitDate)}</StyledTypography>
              </Stack>
            :
              <Stack>
                <Label 
                  startIcon={
                    <Iconify icon='ri:walk-line'/>
                  }
                  sx={{ py: 2 }}
                >
                  Ingreso:
                </Label>

                <StyledTypography variant="body2">
                  {arrivalDate && fDateTime(arrivalDate)}
                </StyledTypography>
              </Stack>
          }
        </Stack>
        
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {notes}
          </StyledTypography>
        </TableCell>
      </TableRow>

      <AuthExitDelivery 
        open={openAuthDialog.value} 
        onClose={openAuthDialog.onToggle}
        item={row}
      />
    </>
  );
}
