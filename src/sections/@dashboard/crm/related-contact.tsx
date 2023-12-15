import { useEffect, useState } from 'react';
// @mui
import { 
    Stack,
    Avatar,
    Skeleton,
    ListItem,
    ListItemText,
    Box
} from '@mui/material';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
// hooks
import { useSnackbar } from "src/components/snackbar";
// 
import { ContactType } from 'src/@types/crm';

// ---------------------------------------------------------------

type RelatedContactsProps = {
  residentId: string
}

// ---------------------------------------------------------------

export function RelatedContact({ residentId }: RelatedContactsProps) {

  const [loading, setLoading] = useState(true);

  const [contact, setContact] = useState<ContactType | null>(null);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const getContactData = async () => {
    setLoading(true);
    try {
      const docRef = doc(DB, 'basic-crm', user?.uid, 'residents', residentId);
      const docData = await getDoc(docRef)
      if (docData.exists()) {
        setContact({ ...docData.data() } as ContactType)
      } else {
        throw new Error(`Este residente no existe`)
      }
    } catch (error) {
      enqueueSnackbar(error, {variant: 'error'})
    }
    setLoading(false);
  };
  
  useEffect(() => {
    getContactData();
  }, []);

  if (loading) return (
    <>
      <Stack 
        alignItems="center" 
        justifyContent="space-between" 
        gap={1}
        sx={{ p: 2.5 }}
      >
        <Skeleton variant="rounded" width='100%' height={30} />
      </Stack>
    </>
  )

  return (
    <>
      <Box sx={{ mb: 1 }}>
        {contact && 
          <ListItem
            sx={{
              px: 0,
              py: 1,
            }}
          >
            <Avatar alt={contact.name} src={contact.photoUrl} sx={{ mr: 2 }} />

            <ListItemText
              primary={`${contact.name} ${contact.lastName}`}
              secondary={
                <span>{contact.type}</span>
              }
              primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
              secondaryTypographyProps={{ noWrap: true, component: 'span' }}
              sx={{ flexGrow: 1, pr: 1 }}
            />
          </ListItem>
        }
      </Box>
    </>
  )
}