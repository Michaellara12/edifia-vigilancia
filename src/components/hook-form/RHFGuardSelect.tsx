import { useEffect, useState } from "react"
import { RHFSelect } from "./RHFSelect"
import { MenuItem, Stack, Avatar, Typography } from "@mui/material"
// firebase
import { collection, getDocs } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';
// @types
import { IGuard } from "src/@types/crm"
//
import { useSnackbar } from 'src/components/snackbar';

// -------------------------------

export default function RHFGuardSelect() {

  const [guards, setGuards] = useState<IGuard[] | []>([])

  const { user } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    async function fetchGuards() {
      try {
        const collectionRef = collection(DB, 'users', user?.uid, 'guards');
        const querySnapshot = await getDocs(collectionRef);
        const guardsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          } as IGuard))
          .filter(guard => guard.isActive); // Filter out guards where isActive is false
        setGuards(guardsData);
      } catch (error) {
        enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      }
    }
  
    fetchGuards();
  }, []);

  return (
    <>
      <RHFSelect
        name='authGuard'
        label="Guarda que autoriza"
        native={false} // Use native dropdown or MUI dropdown, adjust as needed
      >
        {guards.map((guard) => (
          <MenuItem key={guard.id} value={JSON.stringify(guard)}>
            <Stack direction='row' alignItems='center'>
              <Avatar src={guard.avatarUrl} alt={guard.name} sx={{ ml: -0.5, mr: 1 }} />
                <Stack>
                  <Typography variant='subtitle2'>
                    {guard.name}
                  </Typography>
                </Stack>
            </Stack>
          </MenuItem>
        ))}
      </RHFSelect>  
    </>
  )
}