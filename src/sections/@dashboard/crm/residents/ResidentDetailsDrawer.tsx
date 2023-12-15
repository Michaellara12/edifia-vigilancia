// @mui
import { 
  Box,
  Stack,
  Button,
  Divider,
  IconButton,
  Typography,
  Avatar,
  Fab
} from '@mui/material';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
// hooks
import { useBoolean } from 'src/hooks/useBoolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { RelatedContacts } from '../related-contacts';
// @types
import { IResident } from 'src/@types/crm';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IResident;
  //
  onClose: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

export default function ResidentDetailsDrawer({
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
    name, 
    lastName, 
    photoUrl, 
    type, 
    tower, 
    unit,
    whatsapp,
    email,
    company,
    cedula,
    unitId
} = item;

  const properties = useBoolean(true);

  const renderProfile = (
    <Stack 
      gap={1}
      alignItems='center'
    >
      <Avatar 
        src={photoUrl}
        sx={{ height: 120, width: 120 }}
      />
              
      <Typography variant="h6" textAlign='center'>
        {name} {lastName}
      </Typography>

      <Typography variant="subtitle2">
        Torre {tower} Apto. {unit}
      </Typography>

      <Typography variant="body2">
        {type}
      </Typography>

      {/* <Button 
        variant='contained'
        startIcon={<Iconify icon='heroicons-outline:eye'/>}
      >
        Ver perfil completo
      </Button> */}

      <Button 
        startIcon={<Iconify icon='ph:note-pencil-bold'/>}
        onClick={onEdit}
      >
        Editar
      </Button>
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
              WhatsApp
            </Box>
            +{whatsapp}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Email
            </Box>
            {email}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Cédula
            </Box>
            {cedula}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Empresa
            </Box>
            {company}
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

            {renderProperties}
          </Stack>
          <Stack sx={{ pl: 2 }}>
            <RelatedContacts unitId={unitId} currentUserId={id} />
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
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
        </Box>
      </Drawer>
    </>
  );
}
