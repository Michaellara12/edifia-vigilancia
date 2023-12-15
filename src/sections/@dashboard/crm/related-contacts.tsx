import { useEffect, useState } from 'react';
// @mui
import { 
    Stack,
    IconButton,
    Typography,
    Avatar,
    Skeleton,
    ListItem,
    ListItemText,
    Box
} from '@mui/material';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
//
import Iconify from 'src/components/iconify';
import AddEditResidentDialog from './residents/AddEditResidentDialog';
// hooks
import { useBoolean } from 'src/hooks/useBoolean';
import { useSnackbar } from "src/components/snackbar";
// @types
import { IResident, ContactType } from 'src/@types/crm';
// utils
import { parseUnitIdValues } from 'src/utils/parse-unit-id';

// ---------------------------------------------------------------

type RelatedContactsProps = {
  unitId: string;
  currentUserId?: string;
  adddUserWidget?: boolean;
}

type IContactListItem = {
  contact: ContactType;
}

// ---------------------------------------------------------------

export function RelatedContacts({ unitId, currentUserId, adddUserWidget=true }: RelatedContactsProps) {

  const [loading, setLoading] = useState(true);

  const [contacts, setContacts] = useState<ContactType[] | []>([]);

  const openDialog = useBoolean(false);

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const unitValues = parseUnitIdValues(unitId);

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
    unit: unitValues.unit,
    tower: unitValues.tower,
    unitId: unitId,
  } as IResident;

  const getContactsData = () => {
    setLoading(true);
    // Reference the 'residents' collection and apply a query to filter by 'unitId'
    const residentsCollectionRef = collection(DB, 'basic-crm', user?.uid, 'residents');
    const q = query(residentsCollectionRef, where('unitId', '==', unitId));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData: ContactType[] = [];
  
      snapshot.forEach((doc) => {
        const contact = doc.data() as ContactType;
        // In case the admin is creating a new resident from a resident drawer
        // This will show only the users that are NOT the current user selected in drawer
        if (contact.id !== currentUserId) {
            contactsData.push(contact);
        }
      });
      // Set the contacts data and loading state
      setContacts(contactsData);
      setLoading(false);
    }, (error) => {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    });
    // To stop listening when the component unmounts or when you no longer need updates
    return unsubscribe;
  };
  
  useEffect(() => {
    const unsubscribe = getContactsData();
  
    return () => {
      // Unsubscribe when component unmounts
      unsubscribe();
    };
  }, [unitId]);

  if (loading) return (
    <>
      <Stack 
        alignItems="center" 
        justifyContent="space-between" 
        gap={1}
        sx={{ p: 2.5 }}
      >
        <Skeleton variant="rounded" width='100%' height={100} />
      </Stack>
    </>
  )

  return (
    <>
      {adddUserWidget && <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 2 }}>
        <Typography variant="subtitle2"> Contactos relacionados </Typography>

        <IconButton
          size="small"
          color="primary"
          onClick={openDialog.onToggle}
          sx={{
            width: 24,
            height: 24,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <Iconify icon="mingcute:add-line" />
        </IconButton>
      </Stack>}
      
      <Box sx={{ mb: 1 }}>
        {contacts && contacts.length > 0 && contacts.map((contact) => (
          <ContactListItem contact={contact} key={contact.id} />
        ))}
      </Box>

      <AddEditResidentDialog 
        open={openDialog.value}
        onClose={openDialog.onToggle}
        item={newResidentUnitValues}
        isNewItem={true}
      />
    </>
  )
}

// ---------------------------------------------------------------

const ContactListItem = ({ contact }: IContactListItem) => {
  return (
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
  )
}
