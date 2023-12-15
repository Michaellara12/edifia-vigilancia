import { useState } from 'react';
// @mui
import {
  Button,
  Divider,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Stack,
  Avatar
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import ConfirmDialog from 'src/components/confirm-dialog';
import VisitorDetailsDrawer from '../visitor-details-drawer';
import Label from 'src/components/label/Label';
// @types
import { IVisitor } from 'src/@types/crm';
// utils
import { useBoolean } from 'src/hooks/useBoolean';
import useDoubleClick from 'src/hooks/useDoubleClick';
import { fToNow, fDateTime } from 'src/utils/formatTime';
import { StyledTypography } from '../../styles';

// ----------------------------------------------------------------------

type Props = {
  row: IVisitor;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function VisitorsTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
}: Props) {

  // Row columns
  const { 
    photoUrl,
    name,
    company,
    cedula,
    accessType,
    unitId,
    arrivalDate,
    exitDate,
    type,
    vehicle,
    notes,
    parkingTime,
    parkingCost
  } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const details = useBoolean();

  const handleOpenDetails = useDoubleClick({
    click: (e) => {
      const { nodeName } = e.target as HTMLButtonElement;
      if (nodeName !== 'INPUT' && nodeName !== 'circle' && nodeName !== 'svg') {
        details.onTrue();
        handleClosePopover();
      }
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow 
        hover selected={selected} 
        onClick={handleOpenDetails} 
        sx={{ '&:hover': {cursor: 'pointer'} }}
      >
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell>
          <StyledTypography variant="body2">
            {unitId}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <Stack direction='row' gap={2} alignItems='center'>
            <Avatar alt='avatar' src={photoUrl}/>
            <Stack>
              <StyledTypography variant={!!name ? "caption" : "subtitle2"}>
                {type} {!!company && `| ${company}`}
              </StyledTypography>
              
              <StyledTypography variant="subtitle2">
                {name}
              </StyledTypography>

              <StyledTypography variant="body2">
                {!!cedula && `c.c. ${cedula}`}
              </StyledTypography>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
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
                  <Iconify icon={accessType === 'Peatonal' ? 'ri:walk-line' : 'humbleicons:car'}/>
                }
                sx={{ py: 2 }}
              >
                Ingreso {accessType}
              </Label>

              <StyledTypography variant="body2">
                {arrivalDate && fToNow(arrivalDate.toDate())}
              </StyledTypography>
            </Stack>
        }
        </TableCell>

        <TableCell>
          <Stack direction='row' alignItems='center'>
              {vehicle && <Stack direction='row' alignItems='center' gap={1}>
                <Avatar 
                  src={vehicle?.vehiclePhotoUrl} 
                  alt='vehicle' 
                  variant='rounded' 
                  sx={{ width: 50, height: 50 }}
                />
                <Stack>
                  <StyledTypography variant="caption" >
                    {vehicle?.vehicleBrand} | {vehicle?.vehicleColor}
                  </StyledTypography>
                  <StyledTypography variant="subtitle1" >
                    {vehicle?.vehicleType}
                  </StyledTypography>
                  <StyledTypography variant="body2" >
                    {vehicle?.vehicleLicensePlate}
                  </StyledTypography>

                  <StyledTypography variant="caption" >
                    {!!vehicle?.vehicleParkingLot && `Pq. provisional: ${vehicle.vehicleParkingLot}`}
                  </StyledTypography>
                </Stack>
              </Stack>}

              {parkingTime && 
              <>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                <Stack>
                  <Typography variant='caption'>⌛ Tiempo:</Typography>
                  <Typography variant='subtitle1'>{parkingTime}</Typography>
                  <Typography variant='caption'>💰 Cobro:</Typography>
                  <Typography variant='subtitle1'>${parkingCost} COP</Typography>
                </Stack>
              </>}
            </Stack>
        </TableCell>

        <TableCell align="left">
          {notes}
        </TableCell>

        {/* <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      <VisitorDetailsDrawer 
        item={row}
        open={details.value}
        onClose={details.onFalse}
        onDelete={handleOpenConfirm}
      />

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
              
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Eliminar
        </MenuItem>
      </MenuPopover>

      {/* Confirm item deletion */}
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Eliminar"
        content="¿Deseas eliminar este paquete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Eliminar
          </Button>
        }
      />
    </>
  );
}
