// import { useEffect, useState } from 'react';
// @mui
import { Button, Typography } from '@mui/material';
//
import AddEditResidentDialog from '../residents/AddEditResidentDialog';
import { useBoolean } from 'src/hooks/useBoolean';
import Iconify from 'src/components/iconify/Iconify';
// firebase
// import { getDoc, doc } from 'firebase/firestore';
// import { useAuthContext } from 'src/auth/useAuthContext';
// import { DB } from 'src/auth/FirebaseContext';
// @types
import { IResident } from 'src/@types/crm';

// --------------------------------------------

type AddResidentButtonProps = {
    tower?: string
    unit?: string
}

// --------------------------------------------

export default function AddResidentButton({ tower, unit }: AddResidentButtonProps) {
  const openDialog = useBoolean(false);
  // const { user } = useAuthContext()
  // const [doesUnitExists, setDoesUnitExists] = useState(false)

  // const validateUnit = async () => {
  //   const unitId = `${tower}${unit}`
  //   const docRef = doc(DB, 'basic-crm', user?.uid, 'units', unitId)
  //   const unitData = await getDoc(docRef)
  //   if (unitData.exists()) {
  //     setDoesUnitExists(true)
  //   } else {
  //     setDoesUnitExists(false)
  //   }
  // }

  // useEffect(() => {
  //   console.log('tower', tower)
  //   validateUnit()
  // }, [tower, unit])

  // Tower and unit values
  const newResidentUnitValues = {
    type: 'Propietario',
    photoUrl: '',
    name: '',
    lastName: '',
    whatsapp: '',
    email: '',
    company: '',
    cedula: '',
    unit: unit,
    tower: tower,
    unitId: `${tower}${unit}`
  } as IResident;

  // if (!doesUnitExists) return (
  //   <>
  //     <Typography>Selecciona una unidad válida</Typography>
  //   </>
  // )

  return (
    <>
      <Button 
        startIcon={<Iconify icon='ic:baseline-person-add-alt-1'/>}
        onClick={openDialog.onToggle}
        fullWidth
      >
        Agregar nuevo residente
      </Button> 

      <AddEditResidentDialog 
        open={openDialog.value}
        onClose={openDialog.onToggle}
        isNewItem={true}
        item={!!unit ? newResidentUnitValues : null}
    />
    </>
  )
}