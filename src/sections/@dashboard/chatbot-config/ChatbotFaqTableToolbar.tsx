// next
import { useRouter } from 'next/router';
// react
import { useState, useRef } from 'react';
// @mui
import { Stack, InputAdornment, TextField, Button } from '@mui/material';
// firebase
import { doc, setDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
//
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useSnackbar } from "../../../components/snackbar"
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  isFiltered: boolean;
  onResetFilter: VoidFunction;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ChatbotFaqTableToolbar({
  filterName,
  isFiltered,
  onFilterName,
  onResetFilter,
}: Props) {

  const { user } = useAuthContext()

  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const { query: { chatroomId } } = useRouter()

  const { enqueueSnackbar } = useSnackbar()

  const onClose = () => {
    setOpen(false)
  }

  const handleClick = () => {
    setOpen(true)
  }

  // Make -> Algolia webhook
  const url = "https://hook.us1.make.com/7kfu9exw2tytmzs4pu1nh81fpfscxdzf"

  const addNewQnA = async () => {

    const newDocId = uuidv4()

    setLoading(true)
    try {
      const docRef = doc(DB, 'users', user?.uid, 'chatbotFaq', newDocId)

      const payload = {
        id: newDocId, 
        question: questionRef.current?.value ? questionRef.current?.value : "", 
        answer: answerRef.current?.value ? answerRef.current?.value : "",
        userId: user?.uid
      }

      await setDoc(docRef, {
        id: newDocId, 
        question: questionRef.current?.value ? questionRef.current?.value : "", 
        answer: answerRef.current?.value ? answerRef.current?.value : "",
        dateCreated: new Date()
      })

      await axios.post(url, payload)

      enqueueSnackbar('Nueva pregunta agregada')
    } catch (e) {
      enqueueSnackbar('No fue posible agregar la pregunta', { variant: 'error' })
    }

    onClose() 

    setLoading(false)
  }

  const questionRef = useRef<HTMLInputElement>(null)

  const answerRef = useRef<HTMLInputElement>(null)

  function Content() {
    return (
      <Stack gap={3} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Pregunta"
          placeholder='¿Cuáles son los horarios de atención?'
          inputRef={questionRef}
        />

        <TextField
          fullWidth
          label="Respuesta"
          placeholder='Nuestros horarios de atención en la administración del conjunto residencial son de lunes a viernes de 9:00 AM a 6:00 PM, y los sábados de 10:00 AM a 2:00 PM.'
          inputRef={answerRef}
          multiline
        />
      </Stack>
    )
  }

  return (

    <>
      <Stack
        spacing={2}
        alignItems="center"
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{ px: 2.5, py: 3 }}
      >
        <TextField
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder="Busca preguntas o respuestas..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          sx={{ width: {lg: '30%', xs: '100%'}, py: 2 }}
          variant='contained'
          startIcon={<Iconify icon="material-symbols:add-comment-rounded" />}
          onClick={handleClick}
        >
          Crear pregunta
        </Button>

        {isFiltered && (
          <Button
            color="error"
            sx={{ flexShrink: 0 }}
            onClick={onResetFilter}
            startIcon={<Iconify icon="eva:trash-2-outline" />}
          >
            Borrar
          </Button>
        )}
      </Stack>

      <ConfirmDialog 
        title='Agregar nueva pregunta y respuesta' 
        content={<Content />}
        action={
          <Button 
            variant='contained' 
            onClick={addNewQnA}
            disabled={loading}
          >
            Agregar pregunta
          </Button>
        }
        open={open}
        onClose={onClose}
      />
    </>
  );
}