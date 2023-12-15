import Image from 'next/image';
import { useState, useEffect } from 'react';
// @mui
import {
  Box,
  Card,
  Stack,
  Avatar,
  ListItemText,
  Switch,
  IconButton,
  Typography
} from '@mui/material';
// firebase
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';
// types
import { IGuard } from 'src/@types/crm';
//
import { useSnackbar } from "src/components/snackbar";
import Iconify from 'src/components/iconify/Iconify';

// ----------------------------------------------------------------------

export default function Vigilantes() {

  const { user } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar();

  const [guards, setGuards] = useState<IGuard[] | []>([])
  const [noGuards, setNotGuards] = useState(false);

  useEffect(() => {
    const collectionRef = collection(DB, 'users', user?.uid, 'guards')
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      if (snapshot.empty) {
        setNotGuards(true); // Set noGuards to true if collection is empty
      } else {
        const followersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as IGuard));
        setGuards(followersData);
        setNotGuards(false); // Set noGuards to false if collection is not empty
      }
    });
  
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [])

  const handleClick = async (id: string, isActive: boolean) => {
    try {
      const docRef = doc(DB, 'users', user?.uid, 'guards', id)
      await updateDoc(docRef, { isActive: !isActive })
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(DB, 'users', user?.uid, 'guards', id)
      await deleteDoc(docRef)
      enqueueSnackbar(`Guarda eliminado`, { variant: 'warning' })
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' })
    }
  }

  if (noGuards) return (
    <>
      <Stack alignItems='center'>
        <Image src='/assets/illustrations/security-reception.png' width={250} height={250} alt='Recepción de vigilantes'/>
        <Typography variant='h5' textAlign='center'>
          Parece que no has agregado ningún guarda a la plataforma
        </Typography>
        <Typography variant='body2' textAlign='center'>
          Haz click en el botón 'Agregar guarda'
        </Typography>
      </Stack>
    </>
  )

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {guards.map((guard) => (
          <GuardItem
            key={guard.id}
            guard={guard}
            handleClick={handleClick}
            handleDelete={handleDelete}
          />
        ))}
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

type GuardProps = {
  guard: IGuard;
  handleClick: (id: string, isActive: boolean) => void
  handleDelete: (id: string) => void
};

function GuardItem({ guard, handleClick, handleDelete }: GuardProps) {
  const { name, gender, isActive, id, photoUrl } = guard;

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: (theme) => theme.spacing(3, 2, 3, 3),
      }}
    >
      <Avatar alt={name} src={photoUrl as string} sx={{ width: 56, height: 56, mr: 2 }} variant='rounded'/>

      <ListItemText
        primary={name}
        secondary={
          <Stack>
              {id}
            <Stack>
              {gender}
            </Stack>
          </Stack>
        }
        primaryTypographyProps={{
          typography: 'subtitle2',
        }}
        secondaryTypographyProps={{
          mt: 0.5,
          noWrap: true,
          display: 'flex',
          component: 'span',
          alignItems: 'center',
          typography: 'caption',
          color: 'text.disabled',
        }}
      />
      <Stack alignItems='center'>
        <Switch checked={isActive} onClick={() => handleClick(id, isActive)}/>
        <IconButton onClick={() => handleDelete(id)} sx={{ width: 38 }}>
          <Iconify icon='ph:trash-fill' />
        </IconButton>
      </Stack>
    </Card>
  );
}
