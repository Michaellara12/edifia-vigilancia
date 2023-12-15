import { useEffect, useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { 
  Avatar, 
  Divider, 
  Collapse, 
  Typography, 
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { updateDoc, doc } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
// @types
import { ILeadProfile } from '../../../../@types/chat';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from "src/components/snackbar"
//
import ChatRoomCollapseButton from './ChatRoomCollapseButton';

// ----------------------------------------------------------------------

type Props = {
  lead: ILeadProfile;
  isCollapse: boolean;
  onCollapse: VoidFunction;
};

export default function ChatRoomSingle({ lead, isCollapse, onCollapse }: Props) {

  // If the lead data is not provided, don't render the component
  if (!lead) {
    return null;
  }

  const { user } = useAuthContext()

  // Create a state variable for the lead status
  const [leadStatus, setLeadStatus] = useState(lead.leadStatus ? lead.leadStatus : 'abierto');

  // Initialize snackbar to show any errors during Firestore update
  const { enqueueSnackbar } = useSnackbar();

  // Use the useRouter hook from Next.js to get access to the URL parameters
  const { query: { conversationKey, chatroomId } } = useRouter();

  // Whenever the lead status & conversation changes, update the state variable
  useEffect(() => {
    setLeadStatus(lead.leadStatus ? lead.leadStatus : 'abierto');
  }, [lead.leadStatus, conversationKey]);

  // Function to handle changes in the lead status select element
  const handleChange = async (event: SelectChangeEvent) => {
    // Update the state variable with the new value
    setLeadStatus(event.target.value);
    // Create a reference to the document in Firebase Firestore
    const docRef = doc(DB, "users", user?.uid, "chatrooms", conversationKey as string);
    try {
      // Update the document in Firestore
      await updateDoc(docRef, {
        leadStatus: event.target.value
      });
    } catch (error) {
      // Show the error message in the snackbar if there's any error during Firestore update
      enqueueSnackbar(`Oops error: {error}`, { variant: 'error' })
    }
  };

  return (
    <div>
      <Stack alignItems="center" sx={{ py: 4 }}>
        <Avatar
          alt={lead.name}
          src={lead.profilePic}
          sx={{ width: 96, height: 96, mb: 2 }}
        />

        <Typography variant="subtitle1">{lead.name}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {lead.phone}
        </Typography>

        {/* Map the lead status options to MenuItem components */}
        {/* The value of each option corresponds to the lead status value */}
        <Select
          value={leadStatus}
          onChange={handleChange}
          variant='standard'
          sx={{ mt: 1 }}
        >
          <MenuItem value='abierto'> 
            <Stack direction='row' gap={1}>
              <Iconify icon='bxs:chat' color='info.main' /> 
              Abierto
            </Stack>
          </MenuItem>
          <MenuItem value='pendiente'>
            <Stack direction='row' gap={1}>
              <Iconify icon='gg:sand-clock' color='warning.main'/> 
              Pendiente
            </Stack>
          </MenuItem>
          <MenuItem value='resuelto'>
            <Stack direction='row' gap={1}>
              <Iconify icon='fluent-mdl2:skype-check' color='success.main'/> 
              Resuelto
            </Stack>
          </MenuItem>
          <MenuItem value='descartado'>
            <Stack direction='row' gap={1}>
              <Iconify icon='ic:outline-remove-circle' color='error.main'/> 
              Descartado
            </Stack>
          </MenuItem>
        </Select>

      </Stack>

      <Divider />

      {/* Render a collapse button, passing the isCollapse and onCollapse props */}
      <ChatRoomCollapseButton isCollapse={isCollapse} onCollapse={onCollapse}>
        información
      </ChatRoomCollapseButton>

      {/* Map the contact details to Stack components */}
      {/* Each Stack component includes an Iconify icon and a Typography component for the contact detail */}
      <Collapse in={isCollapse}>
        <Stack
          spacing={2}
          sx={{
            p: (theme) => theme.spacing(2, 2.5, 2.5, 2.5),
          }}
        >
          {[
            { icon: 'eva:phone-fill', value: lead.phone },
            // { icon: 'eva:email-fill', value: lead.email },
          ].map((row, index) => (
            <Stack key={row.icon} direction="row">
              <Iconify
                icon={row.icon}
                sx={{
                  mr: 1,
                  mt: 0.5,
                  flexShrink: 0,
                  color: 'text.disabled',
                }}
              />
              <Typography variant="body2" noWrap={index === 2}>
                {row.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Collapse>
    </div>
  );
}
