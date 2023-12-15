// react
import { useEffect, useState, useRef } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Stack } from '@mui/material';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { getDoc, doc } from 'firebase/firestore';
// @types
import { ILeadProfile, IChatTextMessage } from 'src/@types/chat';
//
import ChatHeaderDetail from '../header/ChatHeaderDetail';
import ChatMessageList from '../message/ChatMessageList';
import ChatMessageInput from '../message/ChatMessageInput';
import ChatRoom from './ChatRoom';
// hooks
import { useSnackbar } from "src/components/snackbar"
import { useAuthContext } from 'src/auth/useAuthContext';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function ChatBody() {

    const [leadData, setLeadData] = useState<ILeadProfile>()

    const { query: { conversationKey, chatroomId } } = useRouter();

    const { user } = useAuthContext()

    const { enqueueSnackbar } = useSnackbar();

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      async function getLeadData() {
        const docRef = doc(DB, "users", user?.uid, "chatrooms", conversationKey as string)
        const leadData = await getDoc(docRef)
        if (leadData.exists()) {
            setLeadData({...leadData.data()} as ILeadProfile)
        } else {
          enqueueSnackbar('Oops, no fue posible obtener la información de los chats', { variant: 'error' })
        }
      }
      getLeadData();
    }, [conversationKey])

    const handleSendMessage = async (value: IChatTextMessage) => {
      try {
        axios.post('https://hook.us1.make.com/6sgo2vy7kdsjcd7qdngerpem568yfj5c', value)
      } catch (error) {
        enqueueSnackbar(`Oops, no fue posible enviar el mensaje, error: ${error}`, { variant: 'error' })
      }
    };

    return (
        <>
            <Stack flexGrow={1}>
              <ChatHeaderDetail leadData={leadData} conversationKey={conversationKey as string} chatroomId={chatroomId as string} />
                <Stack
                  direction="row"
                  flexGrow={1}
                  sx={{
                      overflow: 'hidden',
                      borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Stack flexGrow={1}>
                    
                    <ChatMessageList scrollRef={scrollRef}/>
                    
                    <ChatMessageInput 
                      conversationId={conversationKey as string}
                      chatroomId={chatroomId as string}
                      onSend={handleSendMessage}
                      disabled={!!conversationKey}
                      scrollRef={scrollRef}
                      // leadData={leadData}
                    />

                  </Stack>

                  {!!leadData
                    ?
                      <ChatRoom leadData={leadData}/>
                    :
                      null
                  }
                </Stack>
            </Stack>

        </>
    );
}
