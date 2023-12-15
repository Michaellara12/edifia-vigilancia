// @mui
import {
  TableRow,
  TableCell,
  Avatar,
  Stack,
} from '@mui/material';
// @types
import { IMinuta } from 'src/@types/crm';
//
import { fDateTime } from 'src/utils/formatTime';
import { StyledTypography } from '../../styles';

// ----------------------------------------------------------------------

type Props = {
  row: IMinuta;
};

export default function MinutaTableRow({
  row,
}: Props) {

  // Row columns
  const { 
    timestamp,
    notes,
    authGuard
  } = row;

  return (
    <>
      <TableRow>
        <TableCell>
          <StyledTypography variant='body2'>
            {fDateTime(timestamp)}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <Stack direction='row' gap={2} alignItems='center'>
            <Avatar 
              src={authGuard.avatarUrl}
              alt='guard'  
              variant='rounded'
            />
            <Stack>
              <StyledTypography variant='subtitle2'>
                {authGuard.name}
              </StyledTypography>

              <StyledTypography variant='body2'>
                {authGuard.id}
              </StyledTypography>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {notes}
          </StyledTypography>
        </TableCell>
      </TableRow>
    </>
  );
}
