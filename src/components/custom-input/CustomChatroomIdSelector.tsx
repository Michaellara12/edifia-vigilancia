// next
import Router from 'next/router';
// react
import { useState, useEffect } from 'react';
// mui
import { MenuItem, FormControl, SelectChangeEvent, Select, InputLabel, Box, Skeleton } from '@mui/material';
// firebase 
import { DB } from 'src/auth/FirebaseContext';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

type Props = {
  chatroomId: string
  path: string
}

type ChatroomProps = {
  [key: string]: string
} 

export default function ChatNavSelectInput({ chatroomId, path }: Props) {

  const [loading, setLoading] = useState(true);

  const [chatrooms, setChatrooms] = useState<ChatroomProps>()

  const [phoneNumbers, setPhoneNumbers] = useState([])

  const { user } = useAuthContext()

  function getKeyByValue(object: ChatroomProps, value: string) {
    return Object.keys(object).find(key => object[key] === value);
  }

  async function getChatroomsIds() {
    const docRef = doc(DB, "users", user?.uid)
    const docData = await getDoc(docRef)
    if (docData.exists()) {
      const chatroomsData = docData.data().chatrooms
      setChatrooms(chatroomsData)
      setPhoneNumbers(Object.values(chatroomsData))
    } else {
      return
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    if (chatrooms) {
      const chatroomId = getKeyByValue(chatrooms, event.target.value) as string
      Router.push(`${path}${chatroomId}`)
    }
  };


  useEffect(() => {
    getChatroomsIds()
  }, [])

  useEffect(() => {
    if (chatrooms !== undefined && phoneNumbers.length !== 0) {
      setLoading(false)
    } 
    return
  }, [phoneNumbers, chatrooms])

  return (
    <Box sx={{ width: '100%', p: 1 }}>

      {loading
        ?
          <Skeleton />
        :
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Línea de WhatsApp</InputLabel>
            <Select
              value={chatrooms?.[chatroomId]}
              label="Línea de WhatsApp"
              onChange={handleChange}
            >
              {phoneNumbers.map((phoneNumber) => <MenuItem key={phoneNumber} value={phoneNumber}>{phoneNumber}</MenuItem>)}
            </Select>
          </FormControl>
      }
    </Box>
  );
}