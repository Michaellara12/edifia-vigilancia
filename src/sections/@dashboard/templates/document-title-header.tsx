import { useState } from 'react';
import Router from 'next/router';
import { Stack, Button, ClickAwayListener, InputBase, inputBaseClasses } from '@mui/material'
import Iconify from 'src/components/iconify/Iconify';
import { PATH_DASHBOARD } from 'src/routes/paths';
// firebase
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';
//
import { useSnackbar } from "src/components/snackbar";
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { useBoolean } from 'src/hooks/useBoolean';

// -------------------------------------------------------

type IDocumentTitleHeader = {
  documentId: string
  currentTitle: string
}

const DocumentTitleHeader = ({ documentId, currentTitle }: IDocumentTitleHeader) => {
  const [title, setTitle] = useState(currentTitle)
  const [isTitleUpdated, setIsTitleUpdated] = useState(false) // New state for tracking title update

  const { user } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()

  const docRef = doc(DB, 'users', user?.uid, 'documents', documentId)

  const openDialog = useBoolean(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    setIsTitleUpdated(true) // Set true on title change
  }

  const handleUpdateTitle = async () => {
    if (isTitleUpdated && title !== currentTitle) {
      try {
        await updateDoc(docRef, { project_title: title }) 
        enqueueSnackbar('Nombre del documento actualizado') 
        setIsTitleUpdated(false) // Reset the update tracker
      } catch (error) {
        enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' })
      }
    }
  }

  const handleChangeTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleUpdateTitle()
    }
  }

  const handleDeleteDocument = async () => {
    try {
      Router.push(PATH_DASHBOARD.redaccion)
      await deleteDoc(docRef)
      enqueueSnackbar('Documento eliminado', { variant: 'warning' }) 
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' })
    }
  }

  return (
    <Stack direction='row' gap={2} justifyContent='space-between' alignItems='center' sx={{ width: '100%' }}>
      <Button 
        variant='outlined' 
        color='inherit'
        onClick={() => Router.push(PATH_DASHBOARD.redaccion)}
        sx={{ py: 2 }}
      >
        <Iconify icon='pajamas:go-back'/>
      </Button>
      
      <ClickAwayListener onClickAway={handleUpdateTitle}>
        <InputBase
          fullWidth
          placeholder="Nombre del documento"
          defaultValue={title}
          onChange={handleChange}
          onKeyUp={handleChangeTitle}
          sx={{
            px: 2,
            height: 56,
            borderColor: 'text.disabled',
            borderWidth: 1,
            borderStyle: 'dashed',
            borderRadius: 1,
            transition: (theme) => theme.transitions.create(['padding-left', 'border-color']),
            [`&.${inputBaseClasses.focused}`]: {
              pl: 1.5,
              borderColor: 'text.primary',
              borderWidth: 2,
              borderStyle: 'solid',
              borderRadius: 1,
            },
            [`& .${inputBaseClasses.input}`]: {
              typography: 'h4',
            },
          }}
          endAdornment={<Iconify icon='ph:pencil-duotone' color='text.disabled'/>}
        />
    </ClickAwayListener>
    
    <Button
      variant='outlined' 
      color='error'
      onClick={openDialog.onToggle}
    >
      <Iconify icon='tabler:trash'/>
    </Button>

    <ConfirmDialog 
      title='¿Deseas eliminar este documento?'
      open={openDialog.value}
      onClose={openDialog.onToggle}
      content='Esta acción es permanente, una vez elimines el documento no podrás recuperarlo'
      action={
        <Button 
          color='error' 
          variant='contained'
          onClick={handleDeleteDocument}
        >
          Eliminar
        </Button>
      }
    />
    </Stack>
  );
}

export default DocumentTitleHeader;
