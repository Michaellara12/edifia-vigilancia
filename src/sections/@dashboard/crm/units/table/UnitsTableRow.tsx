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
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import ConfirmDialog from 'src/components/confirm-dialog';
import UnitDetailsDrawer from '../UnitDetailsDrawer';
// @types
import { IUnit } from 'src/@types/crm';
//
import { useBoolean } from 'src/hooks/useBoolean';
import useDoubleClick from 'src/hooks/useDoubleClick';

// ----------------------------------------------------------------------

type Props = {
  row: IUnit;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UnitsTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: Props) {

  // Row columns
  const { 
    type,
    tower,
    unit,
    deposit,
    mascots,
    parkingLot
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
        hover 
        selected={selected} 
        onClick={handleOpenDetails}
        sx={{ '&:hover': {cursor: 'pointer'} }}
      >
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Typography variant="body2" >
            {type}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" >
            {tower}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" >
            {unit}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" >
            {deposit}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" >
            {parkingLot}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">
            -
          </Typography>
        </TableCell>
        
        {/* Get only data from first object of type "Carro" or "Moto" */}
        <TableCell>
          <Typography variant="body2">
            -
          </Typography>
        </TableCell>
        {/* Get only data from first object of type "Carro" or "Moto" */}
        <TableCell>
          <Typography variant="body2" >
            {mascots && mascots.length > 0 && mascots[0].type}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" >
            {mascots && mascots.length > 0 && mascots[0].name}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <UnitDetailsDrawer 
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
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Editar
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />
              
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
        content="¿En verdad deseas eliminar esta unidad? 
        Todos los registros de residentes, paquetes, visitas y vehículos relacionados con esta unidad 
        serán eliminados."
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Eliminar
          </Button>
        }
      />
    </>
  );
}
