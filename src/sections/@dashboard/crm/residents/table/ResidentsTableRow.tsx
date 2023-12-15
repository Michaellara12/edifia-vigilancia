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
import ResidentDetailsDrawer from '../ResidentDetailsDrawer';
// @types
import { IResident } from 'src/@types/crm';
//
import { useBoolean } from 'src/hooks/useBoolean';
import useDoubleClick from 'src/hooks/useDoubleClick';

// ----------------------------------------------------------------------

type Props = {
  row: IResident;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ResidentsTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: Props) {

  // Row columns
  const { 
    name, 
    lastName, 
    whatsapp, 
    email, 
    tower,
    unit,
    cedula
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
          <Typography variant="body2">
            {name}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" >
            {lastName}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" >
            {whatsapp}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" >
            {email}
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
          <Typography variant="body2" sx={{ minWidth: 120 }}>
            {cedula}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <ResidentDetailsDrawer 
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
        content="¿En verdad deseas eliminar residente? 
        Todos los registros de paquetes, visitas y vehículos relacionados con este residente
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
