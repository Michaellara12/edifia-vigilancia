import Router from "next/router";
// @mui
import { Card, Box, Stack, Typography, Button } from '@mui/material';
// components
import Iconify from '../../../components/iconify/Iconify';
import { v4 as uuidv4 } from 'uuid';
// firebase
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { DB } from "src/auth/FirebaseContext";
import { useAuthContext } from "src/auth/useAuthContext";
// hooks
import useResponsive from 'src/hooks/useResponsive';
import { useSnackbar } from "src/components/snackbar"; 

// ----------------------------------------------------------------------

export default function ChooseTemplateContainer() {

  const isTablet = useResponsive('down', 'md')

  const { user } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()

  async function handleNewDocument(e:React.MouseEvent<HTMLElement>) {
    e.preventDefault
    try {
      const newDocId = uuidv4()

      const payload = {
        id: newDocId,
        form_input: '',
        project_title: 'Sin título',
        tipo: 'sin-plantilla',
        inFolder: false,
        dateCreated: serverTimestamp(),
        dateModified: serverTimestamp()
      }

      if (user) {
        const docRef = doc(DB, "users", user.uid, "documents", newDocId)
        await setDoc(docRef, payload)
        Router.push(`/dashboard/documentos?document=${newDocId}`)
      }
    } catch (e) {
      enqueueSnackbar(`Oops error: ${e}`, { variant: 'error' });
    }
  } 

  return (
    <>
      <Card 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%', 
          p: 4 
        }}
      >
        <Stack direction='row' alignItems='center' gap={2}>
          <Stack gap={2}>
            <Typography variant='h4' >
              Escribe mejor y más rápido
            </Typography>

            <Typography variant='body2' sx={{ maxWidth: 500 }}>
              Escribe a partir de plantillas (documentos de referencia) o redacta cualquier tipo de texto
              con ayuda de chatGPT.
            </Typography>

            <Button 
              sx={{ maxWidth: {md: 280, xs: '100%'}, py: 1 }}
              variant='contained'
              startIcon={<Iconify icon='fluent:mail-template-16-filled'/>}
              onClick={handleNewDocument}
            >
              Redactar nuevo documento
            </Button>
       
          </Stack>
          
          {isTablet
            ?
              null
            :
            <Box sx={{ minWidth: 220 }}>
              <img alt='contenido' src='/assets/illustrations/typewriter.png'/>
            </Box>
          }
          
        </Stack>
      </Card>
    </>
  );
}