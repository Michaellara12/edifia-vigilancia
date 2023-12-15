// @mui
import { 
  Box,
  Stack,
  Divider,
  IconButton,
  Typography,
  Fab
} from '@mui/material';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
// hooks
import { useBoolean } from 'src/hooks/useBoolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ImageLightbox } from 'src/components/image';
import { RelatedContact } from '../related-contact';
import Label from 'src/components/label/Label';
import { VehicleDrawerTemplate } from '../vehicle-drawer-template';
import { ParkingManager } from './parking-manager';
import { GuardThatAuthorized } from '../guard-that-authorized';
// @types
import { IVisitor } from 'src/@types/crm';
import { fDateTime } from 'src/utils/formatTime';
// utils
import { parseUnitId } from 'src/utils/parse-unit-id';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IVisitor;
  //
  onClose: VoidFunction;
  onDelete: VoidFunction;
};

export default function VisitorDetailsDrawer({
  item,
  open,
  //
  onClose,
  onDelete,
  ...other
}: Props) {

  const { 
    id,
    signature,
    notes,
    name,
    photoUrl, 
    company,
    type, 
    arrivalDate,
    exitDate,
    residentId,
    unitId,
    cedula,
    vehicle,
    parkingCost,
    parkingTime,
    cedulaPhotoUrl,
    authGuard
  } = item;

  const properties = useBoolean(true);

  const unitValues = parseUnitId(unitId);

  // This will stop counter from showing in case 3 days have passed by
  const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
  const currentTime = new Date().getTime();
  const timeSinceArrival = currentTime - arrivalDate.toMillis();
  const noExitRegistered = !exitDate && timeSinceArrival > twoDaysInMilliseconds

  const renderProfile = (
    <Stack 
      gap={0.5}
      alignItems='center'
    >
      {cedulaPhotoUrl 
        ?
          <ImageLightbox image={cedulaPhotoUrl} width={200} height={130}/>
        :
          <ImageLightbox image={photoUrl} />
      }

      <Typography variant="subtitle1">
        {type} {!!company && `| ${company}`}
      </Typography>
              
      {/* Changes whether apto or house */}
      <Typography variant="h6" textAlign='center'>
        {unitValues}
      </Typography>
      
      {noExitRegistered && <Label startIcon={<Iconify icon='mingcute:exit-line'/>} sx={{ py: 2, px: 1.5 }} color='error'>
        +2 días sin registrar salida
      </Label>}

      {!noExitRegistered 
        && parkingTime
        &&
          <Stack>
            <Label startIcon={<Iconify icon='mingcute:exit-line'/>} sx={{ py: 2, px: 1.5 }} color='error'>
              Salida
            </Label>
            <Stack sx={{ mt: 1 }}>
              <Typography variant='caption' alignSelf='center' sx={{ mb: -1 }}>Tiempo:</Typography>
              <Stack direction='row' alignItems='center'>
                <Iconify icon='ph:clock-bold' />
                <Typography variant='h3' sx={{ ml: 1 }}>{parkingTime}</Typography>
              </Stack>
            </Stack>
            
            <Stack>
              <Typography variant='caption' alignSelf='center'>Costo estimado:</Typography>
              <Typography variant='h5' sx={{ ml: 1 }} textAlign='center'>
                💵 {parkingCost} COP
              </Typography>
            </Stack>
          </Stack>
        }

          <>
            {!exitDate
              && !noExitRegistered
              && vehicle?.vehicleType
              && vehicle.vehicleType !== 'Bicicleta'  
              && <ParkingManager 
                    arrivalDate={arrivalDate} 
                    vehicleType={vehicle.vehicleType}
                    visitorId={id}
                    onClose={onClose}
                  />
            }
          </>
    </Stack>
  )

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Información
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <>
          {!!name && <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Nombre
            </Box>
            {name}
          </Stack>}

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Fecha ingreso
            </Box>
            {arrivalDate && fDateTime(arrivalDate.toDate())}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Fecha salida
            </Box>
            {!!exitDate ? fDateTime(exitDate.toDate()) : '-'}
          </Stack>

          {!!cedula && <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              c.c.
            </Box>
            {cedula}
          </Stack>}

          {!!notes && <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Notas
            </Box>
            {notes}
          </Stack>}
        </>
      )}
    </Stack>
  );

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
          sx: { width: 320, bgcolor: 'background.default' },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{
              p: 2.5,
              bgcolor: 'background.default',
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

            {renderProperties}

            {authGuard && <GuardThatAuthorized guard={authGuard}/>}

            {!!vehicle && <VehicleDrawerTemplate {...vehicle} />}

            <Stack>
              <Typography variant='subtitle2'>Residente que autorizó ingreso:</Typography>
              {residentId && <RelatedContact residentId={residentId}/>}
            </Stack>

            {/* Signature */}
            {!!signature && 
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                <img src={signature} alt='signature'/>
              </Box>
            }
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
