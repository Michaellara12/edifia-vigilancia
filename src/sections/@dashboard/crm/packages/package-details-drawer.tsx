import Router from 'next/router';
// @mui
import { 
  Box,
  Stack,
  Button,
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
import { GuardThatAuthorized } from '../guard-that-authorized';
// @types
import { IPackage } from 'src/@types/crm';
import { fDateTime } from 'src/utils/formatTime';
// paths
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IPackage;
  //
  onClose: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

export default function PackageDetailsDrawer({
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
    signature,
    notes,
    photoUrl, 
    type, 
    tower, 
    unit,
    arrivalDate,
    pickupDate,
    residentId,
    authGuard
} = item;

  const properties = useBoolean(true);

  const handleDeliverPackage = () => {
    Router.push(`${PATH_DASHBOARD.registroCorrespondencia.deliverMail}/?itemId=${id}`)
  }

  const renderProfile = (
    <Stack 
      gap={1}
      alignItems='center'
    >
      <ImageLightbox image={photoUrl} />
              
      {/* Changes whether apto or house */}
      <Typography variant="h6" textAlign='center'>
        {!!tower
          ?
            `Torre ${tower} Apto. ${unit}`
          :
            `Casa ${unit}`
        }
      </Typography>

      <Typography variant="subtitle1">
        {type}
      </Typography>
      
      {!!pickupDate 
        ?
          <Label startIcon={<Iconify icon='gg:check-o'/>} sx={{ py: 2, px: 1.5 }} color='success'>
            Entregado
          </Label>
        :
          <>
            <Button 
              variant='contained'
              startIcon={<Iconify icon='icon-park-twotone:delivery'/>}
              onClick={handleDeliverPackage}
            >
              Entregar paquete
            </Button>

            {/* <Button 
              startIcon={<Iconify icon='ph:note-pencil-bold'/>}
              onClick={onEdit}
            >
              Editar
            </Button> */}
          </>
      }

      
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
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Recepción
            </Box>
            {arrivalDate && fDateTime(arrivalDate.toDate())}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Entrega
            </Box>
            {pickupDate ? fDateTime(pickupDate.toDate()) : '-'}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Notas
            </Box>
            {!!notes ? notes : '-'}
          </Stack>

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

            {/* Signature */}
            {pickupDate !== undefined && 
              <Stack>
                <Typography variant='subtitle2'>Residente que recibió paquete:</Typography>
                {residentId && <RelatedContact residentId={residentId}/>}
                <Box sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                  <img src={signature} alt='signature'/>
                </Box>
              </Stack>
            }
          </Stack>
        </Scrollbar>

        {/* <Box sx={{ p: 2.5 }}>
          <Button
            fullWidth
            variant="soft"
            color="error"
            size="large"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={onDelete}
          >
            Eliminar
          </Button>
        </Box> */}
      </Drawer>
    </>
  );
}
