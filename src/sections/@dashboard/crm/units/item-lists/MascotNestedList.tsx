// @mui
import { 
    Stack,
    IconButton,
    Button,
    Avatar,
    Typography
} from '@mui/material';
// firebase
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';
//
import Iconify from 'src/components/iconify/Iconify';
import { useBoolean } from 'src/hooks/useBoolean';
import { IUnitMascot } from 'src/@types/crm';
import AddEditMascot from './dialogs/AddEditMascot';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { useSnackbar } from "src/components/snackbar";

// ------------------------------------------------------------

type Props = {
  mascots: IUnitMascot[] | [];
  unitId: string;
}

type ItemListProps = {
  mascot: IUnitMascot;
  unitId: string;
}

// ------------------------------------------------------------

export function MascotNestedList({ mascots, unitId }: Props) {

  const properties = useBoolean(false);

  const addMascotDialog = useBoolean(false);

  return (
    <>
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
        onClick={properties.onToggle}
      >
        Mascotas
        <Stack direction='row'>
            <Iconify
              icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              color='text.secondary'
            />
        </Stack>
        
      </Stack>

      {properties.value && (
        <Button
          startIcon={<Iconify icon='fluent:animal-dog-16-regular'/>}
          onClick={addMascotDialog.onToggle}
        >
          Agregar mascota
        </Button>
      )}
      

      {properties.value && mascots && (mascots.length > 0) && (
        <>
          {mascots.map((mascot) => (
            <ItemList 
              key={mascot.id}
              mascot={mascot} 
              unitId={unitId}
            />
          ))}
        </>
      )}
    </Stack>

    {/* Add mascot */}
    <AddEditMascot 
      item={null} 
      open={addMascotDialog.value} 
      onClose={addMascotDialog.onToggle}
      unitId={unitId}
    />
    </>
  );
}

// ------------------------------------------------------------

const ItemList = ({ mascot, unitId }: ItemListProps) => {

  const deleteMascotDialog = useBoolean(false);

  const editMascotDialog = useBoolean(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      const docRef = doc(DB, 'crm', user?.uid, 'units', unitId);
  
      // Get the current document data
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const currentData = docSnapshot.data();
  
        // Find the index of the mascot object to delete in the 'mascots' array
        const mascotsArray = currentData.mascots || [];
        const indexToDelete = mascotsArray.findIndex((item: IUnitMascot) => item.id === mascot.id);
  
        if (indexToDelete !== -1) {
          // Remove the mascot object from the 'mascots' array
          mascotsArray.splice(indexToDelete, 1);
  
          // Update the document with the modified 'mascots' array
          await updateDoc(docRef, { mascots: mascotsArray });
  
          enqueueSnackbar('Mascota eliminada', { variant: 'warning' });
        } else {
          enqueueSnackbar('No se encontró la mascota para eliminar', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Documento no encontrado', { variant: 'error' });
      }
    } catch (e) {
      enqueueSnackbar('No fue posible eliminar la mascota', { variant: 'error' });
    }

    deleteMascotDialog.setValue(false)
  };
  

  return (
    <>
      <Stack 
        direction="row" 
        justifyContent='space-between' 
        alignItems='center'
        key={mascot.id}
      >
        <Stack direction="row" gap={1.5} alignItems='center'>
          <Avatar 
            src={mascot.photoUrl}
            variant="rounded"
            sx={{width: 60, height: 60 }}
          />

          <Stack>
            <Typography variant='caption'>
              {mascot.type} {mascot.race && `| ${mascot.race}`}
            </Typography>

            <Typography variant='subtitle2' sx={{ maxWidth: 140 }}>
              {mascot.name}
            </Typography>

            <Typography variant='caption' sx={{ maxWidth: 140 }}>
              {mascot.color}
            </Typography>
          </Stack>
      </Stack>

      {/* Add and delete icon buttons */}
      <Stack direction='row'>
        <IconButton 
          size="small"
          onClick={editMascotDialog.onToggle}
        >
          <Iconify icon='akar-icons:edit'/>
        </IconButton>

        <IconButton size="small">
          <Iconify 
            icon='ph:trash-bold'
            onClick={deleteMascotDialog.onToggle}
          />
        </IconButton>
      </Stack>
    </Stack>

    {/* Edit mascot */}
    <AddEditMascot 
      item={mascot} 
      open={editMascotDialog.value} 
      onClose={editMascotDialog.onToggle}
      unitId={unitId}
    />

    {/* Confirm item deletion */}
    <ConfirmDialog
      open={deleteMascotDialog.value}
      onClose={deleteMascotDialog.onToggle}
      title="Eliminar"
      content="¿Deseas eliminar esta mascota?"
      action={
        <Button variant="contained" color="error" onClick={onDelete}>
          Eliminar
        </Button>
      }
    />
    </>
  )
}