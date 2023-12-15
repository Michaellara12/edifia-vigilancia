import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { collection, doc, onSnapshot, orderBy, query, QuerySnapshot, DocumentData, updateDoc } from 'firebase/firestore';
import Scrollbar from 'src/components/scrollbar';
import ChatMessageItem from './ChatMessageItem';
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IChatTextMessage } from 'src/@types/chat';

// ----------------------------------------------------------------------

type Props =  {
  scrollRef: React.RefObject<HTMLDivElement>;
}


export default function ChatMessageList({ scrollRef }: Props) {

  const [loading, setLoading] = useState(true);
  
  const [messages, setMessages] = useState<{ [key: string]: IChatTextMessage[] }>({});
  
  const { query: { conversationKey } } = useRouter();

  const { user } = useAuthContext()

  useEffect(() => {
    // Function to fetch messages for the current conversation key
    async function fetchMessages() {
      const collectionRef = collection(DB, 'users', user?.uid, 'chatrooms', conversationKey as string, 'messages');
      const q = query(collectionRef, orderBy('timestamp', 'asc'));

      // Attach an event listener to the query snapshot
      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
        const conversationMessages = snapshot.docs.map((doc) => {
          return { ...doc.data() } as IChatTextMessage;
        });

        // Update the messages state object with the messages for the current conversation key
        setMessages((prevMessages) => ({
          ...prevMessages,
          [conversationKey as string]: conversationMessages,
        }));
      });

      return () => {
        unsubscribe();
      };
    }

    fetchMessages();
  }, [conversationKey]);

  async function markMessageAsSeen() {
    const docRef = doc(DB, 'users', user?.uid, 'chatrooms', conversationKey as string);
    await updateDoc(docRef, { unreadCount: 0 });
  }

  const scrollMessagesToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const conversationMessages = messages[conversationKey as string] || [];

    if (conversationMessages.length !== 0) {
      setLoading(false);
    }
  }, [conversationKey, messages]);

  useEffect(() => {
    scrollMessagesToBottom();
    markMessageAsSeen();
  }, []); // Empty array as the second argument to run only once on component mount

  useEffect(() => {
    scrollMessagesToBottom();
    markMessageAsSeen();
  }, [conversationKey, messages]);

  const conversationMessages = messages[conversationKey as string] || [];

  return (
    <>
      <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          conversationMessages.map((message) => <ChatMessageItem key={message.id} message={message} />)
        )}
      </Scrollbar>
    </>
  );
}
