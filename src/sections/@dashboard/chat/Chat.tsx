// next
import { useRouter } from 'next/router';
// @mui
import { Box, Typography, Stack } from '@mui/material';
// components
import ChatNavSidebar from './nav/ChatNavSidebar';
import ChatBody from './room/ChatBody';

// ----------------------------------------------------------------------

export default function Chat() {

  const { query: { conversationKey } } = useRouter();

  const detailView = !!conversationKey;

  return (
        <>
          <ChatNavSidebar />
                  
            {detailView
              ?
                <ChatBody />
              :
                <Stack direction='column' spacing={2} alignItems='center' justifyContent='center' sx={{width: '100%'}} >
                  <Box sx={{width: {md: '50%'}, display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
                    <img src="/assets/illustrations/girl.png"/>
                  </Box>
                  <Typography variant='h4' align='center' sx={{mx: 3}}>Selecciona una conversación 📱💬</Typography>
                </Stack>
            }
        </>
  );
}