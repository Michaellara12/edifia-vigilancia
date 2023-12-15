import { useEffect, useState } from 'react';
// @mui
import { 
    Stack,
    IconButton,
    Button,
    Avatar,
    Typography
} from '@mui/material';
// firebase
import { doc, deleteDoc, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';
//
import Iconify from 'src/components/iconify/Iconify';
// hooks
import { useBoolean } from 'src/hooks/useBoolean';
import { useSnackbar } from "src/components/snackbar";
//
import AddEditVehicleDialog from 'src/sections/@dashboard/crm/vehicles/add-edit-vehicle-dialog';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
// @types
import { IUnitVehicle } from 'src/@types/crm';

// ------------------------------------------------------------

type VehicleNestedListProps = {
  unitId: string
}

type ItemListProps = {
  vehicle: IUnitVehicle;
}

// ------------------------------------------------------------

export function VehicleNestedList({ unitId }: VehicleNestedListProps) {

  const properties = useBoolean(false);

  const addVehicleDialog = useBoolean(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();
  
  const [vehicles, setVehicles] = useState<IUnitVehicle[] | []>([])
  
  useEffect(() => {
    const vehiclesCollectionRef = collection(DB, 'basic-crm', user?.uid, 'vehicles');
    const q = query(vehiclesCollectionRef, where('unitId', '==', unitId));

    // Attaching the snapshot listener. This will trigger every time the data changes.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const vehicles = querySnapshot.docs.map(doc => ({...doc.data()} as IUnitVehicle));
        setVehicles(vehicles);
      } catch (error) {
        enqueueSnackbar(`Oops: error: ${error}`, { variant: 'error' });
      }
    });

    // Clean up the subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [unitId]);

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
        Vehículos
        <Stack direction='row'>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            color='text.secondary'
          />
        </Stack>
        
      </Stack>

      {properties.value && (
        <Button
          startIcon={<Iconify icon='la:car-side'/>}
          onClick={addVehicleDialog.onToggle}
        >
          Agregar vehículo
        </Button>
      )}
      

      {properties.value && vehicles && (vehicles.length > 0) && (
        <>
          {vehicles.map((vehicle) => (
            <ItemList 
              key={vehicle.id}
              vehicle={vehicle} 
            />
          ))}
        </>
      )}
    </Stack>

    {/* add vehicle */}
    <AddEditVehicleDialog
      open={addVehicleDialog.value} 
      onClose={addVehicleDialog.onToggle}
      unitId={unitId}
    />

    </>
  );
}

// ------------------------------------------------------------

const ItemList = ({ vehicle }: ItemListProps) => {

  const deleteVehicleDialog = useBoolean(false);

  const editVehicleDialog = useBoolean(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      const vehicleDocRef = doc(DB, 'basic-crm', user?.uid, 'vehicles', vehicle.id);
      const vehicleControlCollectionRef = collection(DB, 'basic-crm', user?.uid, 'units', vehicle.unitId, 'vehicle-control');
  
      // Query documents where vehicleId is equal to vehicle.id
      const q = query(vehicleControlCollectionRef, where('vehicleId', '==', vehicle.id));
      const querySnapshot = await getDocs(q);
  
      // Delete all documents that match the query
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
  
      // Once all related documents are deleted, delete the original vehicle document
      await deleteDoc(vehicleDocRef);
  
      enqueueSnackbar('El vehículo fue eliminado', { variant: 'warning' });
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    } finally {
      deleteVehicleDialog.setValue(false);
    }
  };

  return (
    <>
      <Stack 
        direction="row" 
        justifyContent='space-between' 
        alignItems='center'
        key={vehicle.id}
      >
        <Stack direction="row" gap={1.5} alignItems='center'>
          <Avatar 
            src={vehicle.photoUrl}
            variant="rounded"
            sx={{width: 60, height: 60 }}
          />

          <Stack>
            <Typography variant='caption'>
              {vehicle.type} {vehicle.brand && `| ${vehicle.brand}`}
            </Typography>

            <Typography variant='subtitle2' sx={{ maxWidth: 140 }}>
              {vehicle.licensePlate}
            </Typography>

            <Typography variant='caption' sx={{ maxWidth: 140 }}>
              {vehicle.color}
            </Typography>
          </Stack>
      </Stack>

      {/* Add and delete icon buttons */}
      <Stack direction='row'>
        <IconButton 
          size="small"
          onClick={editVehicleDialog.onToggle}
        >
          <Iconify icon='akar-icons:edit'/>
        </IconButton>

        <IconButton size="small">
          <Iconify 
            icon='ph:trash-bold'
            onClick={deleteVehicleDialog.onToggle}
          />
        </IconButton>
      </Stack>
    </Stack>

    {/* edit vehicle */}
    <AddEditVehicleDialog
      open={editVehicleDialog.value} 
      onClose={editVehicleDialog.onToggle}
      item={vehicle}
    />

    {/* Confirm item deletion */}
    <ConfirmDialog
      open={deleteVehicleDialog.value}
      onClose={deleteVehicleDialog.onToggle}
      title="Eliminar"
      content="Al eliminar este vehículo se van a eliminar permanentemente todos los registros de ingreso, salida o cualquier otro dato relacionado."
      action={
        <Button variant="contained" color="error" onClick={onDelete}>
          Eliminar
        </Button>
      }
    />
    </>
  )
}