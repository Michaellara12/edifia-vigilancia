import { useEffect, useState } from 'react';
// @mui
import { 
  Stack, 
  Typography, 
  Tooltip,
  Skeleton, 
  Switch, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Chip 
} from '@mui/material';
// utils
import { fToNow } from '../../../../utils/formatTime';
import { useSnackbar } from "src/components/snackbar";
import useResponsive from 'src/hooks/useResponsive';
import { v4 as uuidv4 } from 'uuid';
// @types
import { ILeadProfile } from 'src/@types/chat';
// components
import Iconify from '../../../../components/iconify';
import { CustomAvatar } from '../../../../components/custom-avatar';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { updateDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

type Props = {
    leadData: ILeadProfile | undefined;
    chatroomId: string;
    conversationKey: string;
}

export default function ChatHeaderDetail({ chatroomId, conversationKey }: Props) {

  const { user } = useAuthContext()

  const [loading, setLoading] = useState(true)

  const [dialogLoading, setDialogLoading] = useState(false)

  const [open, setOpen] = useState(false)

  const [openDeleteMemory, setOpenDeleteMemory] = useState(false)

  const [leadData, setLeadData] = useState<ILeadProfile>()

  const [isNomanActive, setIsNomanActive] = useState(false)

  const { enqueueSnackbar } = useSnackbar()

  const isMobile = useResponsive('down', 'sm');

  useEffect(() => {
    const docRef = doc(DB, "users", user?.uid, "chatrooms", conversationKey as string)
  
    const unsubscribe = onSnapshot(docRef, (doc) => {
      try {
        if (doc.exists()) {
          setLeadData({...doc.data()} as ILeadProfile)
          setIsNomanActive(doc.data().isNomanActive)
        } else {
          enqueueSnackbar(`Oops no fue posible obtener la información`)
        }
      } catch (error) {
        enqueueSnackbar(`Oops error: ${error}`)
      }
    })

    return () => unsubscribe()

  }, [chatroomId, conversationKey])
  

  useEffect(() => {
    if (!!leadData) {
        setLoading(false)
    }
    return; 
  }, [leadData])

  // Switch states
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  async function handleIsNomanActiveState() {
    handleClose()
    const docRef = doc(DB, 'users', user?.uid, 'chatrooms', conversationKey)
    await updateDoc(docRef, { isNomanActive: !leadData?.isNomanActive })
  }

  // Delete memory
  const handleCloseDeleteMemory = () => {
    setOpenDeleteMemory(false);
  };

  const handleOpenDeleteMemory = () => {
    setOpenDeleteMemory(true);
  };

  async function handleDeleteMemory() {

    setDialogLoading(true)
    
    // Generate a new UUID
    const newUuid = uuidv4()
    
    const docRef = doc(DB, 'users', user?.uid, 'chatrooms', conversationKey)

    // Message that tells the user that the memory has been deleted
    const newMessageRef = doc(DB, 'users', user?.uid, 'chatrooms', conversationKey, "messages", newUuid)
    // Update the document
    await updateDoc(docRef, { memoria: '' });

    // Create a new document in the messages collection with the generated UUID
    await setDoc(newMessageRef, {
      id: newUuid,
      type: 'error',
      message: 'La memoria de Edifia fue eliminada',
      timestamp: new Date(),
      read: false,
      sender: 'team'
    });

    setDialogLoading(false)

    handleCloseDeleteMemory()

    enqueueSnackbar("La memoria fue eliminada", { variant: 'info' })

  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: (theme) => theme.spacing(2, 1, 2, 2),
        }}
      >
          <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
            {loading
              ?
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Stack>
                    <Skeleton width={100} height={15} />
                    <Skeleton width={60} height={15} />
                  </Stack>
                </Stack>
              :
                <Stack direction="row" gap={2} alignItems="center">
                  <CustomAvatar
                      src={leadData?.profilePic}
                      alt={leadData?.name}
                  />

                  <Stack>
                      <Typography variant="subtitle2">{leadData?.name}</Typography>

                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {leadData?.lastActivity.toDate().getTime() && fToNow(leadData.lastActivity.toDate().getTime())}
                      </Typography>
                  </Stack>

                  {!isMobile && <LeadStatusChip leadStatus={leadData?.leadStatus ? leadData?.leadStatus : 'abierto'}/>}

                </Stack>
            }
            
          </Stack>
    
        <Switch checked={isNomanActive} onClick={handleOpen} />

        <Tooltip title='Borrar memoria del chatbot' placement='bottom'>
          <IconButton onClick={handleOpenDeleteMemory} >
            <Iconify icon="gridicons:trash" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Turn Noman Off */}
      <Dialog open={open} onClose={handleClose}>
        {isNomanActive
          ?
            <>
              <DialogTitle>¿En verdad deseas apagar a Edifia?</DialogTitle>
              <DialogContent>
                Edifia dejará de comunicarse con este usuario. <br/>Puedes encender a Edifia una vez más haciendo click en el switch que esta en la parte superior derecha.
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} variant='contained'>Cancelar</Button>
                <Button onClick={handleIsNomanActiveState} >Apagar</Button>
              </DialogActions>
            </>
          :
            <>
              <DialogTitle>¿Deseas encender a Edifia?</DialogTitle>
              <DialogContent>
                Edifia va a retomar la conversación donde la dejaste ;)<br/>Cualquier mensaje que enviaste va a quedar almacenado en la memoria de Noman.
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button variant='contained' onClick={handleIsNomanActiveState} >Encender</Button>
              </DialogActions>
            </>
        }
      </Dialog>

      {/* Delete memory */}
      <Dialog open={openDeleteMemory} onClose={handleCloseDeleteMemory} >
            <>
              <DialogTitle>¿En verdad deseas eliminar la memoria que tiene Edifia con este usuario?</DialogTitle>
              <DialogContent>
                Al eliminar la memoria, Edifia no recordará ningún dato importante del cliente o de la conversación que se ha tenido hasta el momento. <br/>
                Eliminar la memoria ayuda a que Edifia tome en cuenta las últimas actualizaciones en preguntas y productos que se han hecho<br />
                Eliminar la memoria ayuda a que Edifia deje de 'alucinar' productos o respuestas falsas.
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={handleCloseDeleteMemory} 
                  variant='contained'
                  disabled={dialogLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleDeleteMemory} 
                  variant='outlined' 
                  disabled={dialogLoading}  
                >
                  Borrar memoria
                </Button>
              </DialogActions>
            </>
      </Dialog>

    </>
  );
}

// ----------------------------------------------------------------------

type leadStatusProps = {
  leadStatus: string;
}

const LeadStatusChip = ({ leadStatus }: leadStatusProps) => {
  
  if (leadStatus === 'pendiente') return (
    <Chip 
      label='Pendiente' 
      color='warning' 
      variant="outlined"
      icon={<Iconify icon='gg:sand-clock'/>} 
      sx={{ pl: 0.5 }}
    />
  )

  if (leadStatus === 'resuelto') return (
    <Chip 
      label='Resuelto' 
      color='success' 
      variant="outlined"
      icon={<Iconify icon='fluent-mdl2:skype-check'/>} 
      sx={{ pl: 0.5 }}
    />
  )

  if (leadStatus === 'descartado') return (
    <Chip 
      label='Descartado' 
      color='error' 
      variant="outlined"
      icon={<Iconify icon='ic:outline-remove-circle'/>} 
      sx={{ pl: 0.5 }}
    />
  )

  return (
    <Chip 
      label='Abierto' 
      color='info' 
      variant="outlined"
      icon={<Iconify icon='bxs:chat'/>} 
      sx={{ pl: 0.5 }}
    />
  )

}