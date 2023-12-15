import { useState } from 'react';
// @mui
import {
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Stack
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import ConfirmDialog from 'src/components/confirm-dialog';
import PackageDetailsDrawer from '../package-details-drawer';
import Label from 'src/components/label/Label';
// @types
import { IPackage } from 'src/@types/crm';
//
import { useBoolean } from 'src/hooks/useBoolean';
import useDoubleClick from 'src/hooks/useDoubleClick';
import { fToNow, fDateTime } from 'src/utils/formatTime';
import { StyledTypography } from '../../styles';

// ----------------------------------------------------------------------

type Props = {
  row: IPackage;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function PackagesTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: Props) {

  // Row columns
  const { 
    unitId,
    arrivalDate,
    pickupDate,
    type,
    notes, 
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
          <StyledTypography variant='body2'>
            {unitId}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <Stack gap={1} alignItems='flex-start'>
            <Label
              color={!!pickupDate ? 'success' : 'warning'}
              sx={{ py: 2 }}
              startIcon={<Iconify icon={!!pickupDate ? 'gg:check-o' : 'ph:clock-bold'} />}
            >
              {!!pickupDate ? 'Entregado' : 'En recepción...'}
            </Label>
            {!!pickupDate && arrivalDate ? null : fToNow(arrivalDate?.toDate())}
          </Stack>
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {arrivalDate && fDateTime(arrivalDate.toDate())}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {pickupDate ? fDateTime(pickupDate) : '-'}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {type}
          </StyledTypography>
        </TableCell>

        <TableCell>
          <StyledTypography variant='body2'>
            {notes}
          </StyledTypography>
        </TableCell>

        {/* <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      <PackageDetailsDrawer 
        item={row}
        open={details.value}
        onClose={details.onFalse}
        onEdit={onEditRow}
        onDelete={handleOpenConfirm}
      />

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {/* <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Editar
        </MenuItem> */}

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
