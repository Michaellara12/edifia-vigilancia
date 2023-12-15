// @mui
import { 
  Stack,
  Divider,
  Button,
  Typography,
  Avatar,
  Fab
} from '@mui/material';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
// components
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify/Iconify';
//
import { MascotNestedList } from './item-lists/MascotNestedList';
import { VehicleNestedList } from './item-lists/vehicle-nested-list';
import { RelatedContacts } from '../related-contacts';
// @types
import { IUnit } from 'src/@types/crm';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IUnit;
  //
  onClose: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

export default function UnitDetailsDrawer({
  item,
  open,
  //
  onClose,
  onEdit,
  onDelete,
  ...other
}: Props) {
  const { 
    id,
    photoUrl,
    type, 
    tower, 
    unit,
    coef,
    deposit,
    secondDeposit,
    parkingLot,
    secondParkingLot,
    mascots,
} = item;

  const renderProfile = (
    <Stack 
      gap={1}
      alignItems='center'
    >
      <Avatar 
        src={photoUrl}
        sx={{ height: 120, width: 120 }}
        variant="rounded"
      />
      {/* Changes whether apto or house */}
      <Typography variant="h6" textAlign='center'>
        {type === 'Apartamento'
          ?
            `Torre ${tower} Apto. ${unit}`
          :
            `Casa ${unit}`
        }
      </Typography>

      {parkingLot && 
        <Typography variant="subtitle1">
          Parqueadero: {parkingLot}
        </Typography>
      }

      {secondParkingLot && 
        <Typography variant="body2">
          Parqueadero secundario: {secondParkingLot}
        </Typography>
      }

      {deposit && 
        <Typography variant="subtitle2">
          Depósito: {deposit}
        </Typography>
      }

      {secondDeposit &&
        <Typography variant="body2">
          Depósito secundario: {secondDeposit}
        </Typography>
      }

      <Typography variant="body2">
        Coeficiente: {coef}
      </Typography>

      <Button 
        startIcon={<Iconify icon='ph:note-pencil-bold'/>}
        onClick={onEdit}
      >
        Editar
      </Button>
    </Stack>
  )

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 320 },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{
              p: 2.5,
              bgcolor: 'background.neutral',
            }}
          >
            {/* Close drawer button */}
            <Stack alignItems='flex-start' sx={{ mb: -2 }}>
              <Fab color='inherit' onClick={onClose} size='small'>
                <Iconify icon='iconamoon:close-bold' sx={{ width: 18, height: 18 }}/> 
              </Fab>
            </Stack>

            {renderProfile}

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MascotNestedList mascots={mascots} unitId={id} />
            <VehicleNestedList unitId={id} />
          </Stack>
          <Stack sx={{ pl: 2 }}>
            <RelatedContacts unitId={id}/>
          </Stack>
          
        </Scrollbar>
      </Drawer>
    </>
  );
}