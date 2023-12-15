import { 
  Dialog, 
  Button, 
  DialogTitle, 
  DialogActions, 
  DialogContent, 
  DialogProps, 
  SelectChangeEvent, 
  Box, 
  FormControl, 
  InputLabel, 
  Select ,
  MenuItem,
  Skeleton
} from '@mui/material';

//
import { useState } from 'react';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';


// ----------------------------------------------------------------------

interface ConfirmDialogProps extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  folders: [string, string][];
  fileId: string;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

// ----------------------------------------------------------------------


function AddFileToFolder({ title, open, onClose, folders, fileId, loading, setLoading, ...other }: ConfirmDialogProps) {

  const { user } = useAuthContext()

  const [folder, setFolder] = useState('')

  const [enableButton, setEnableButton] = useState(true)

  const handleSelectFormChange = (event:SelectChangeEvent<string>) => {
    setFolder(event.target.value);
    setEnableButton(false)
  };

  async function handleMoveToFolder() {
    setEnableButton(true)
    setLoading(true)
    // remove file from folder
    if (!!folder) {
      const folderRef = doc(DB, "users", user?.uid, "documents", folder)
      const folderDoc = await getDoc(folderRef)
      const filesArray = folderDoc.data()?.files
      filesArray.push(fileId)
      
      // update folder doc
      await updateDoc(folderRef, {
        files: filesArray
      })
    }
    
    // update inFolder variable
    const fileRef = doc(DB, "users", user?.uid, "documents", fileId)
    await updateDoc(fileRef, {
      inFolder: true
    })

    setLoading(false);
    setEnableButton(false)
    onClose();
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
      <DialogContent>
        {loading
          ?
            <Skeleton width='100%' height={80}/>
          :
            (folders.length === 0)
            ?
              <h4>Aún no has creado ninguna carpeta</h4>
            :
            <Box sx={{ minWidth: 120, my: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Carpeta</InputLabel>
                <Select
                  value={folder}
                  label="Carpeta"
                  onChange={handleSelectFormChange}
                >
                  {folders.map(folder => <MenuItem value={folder[0]} key={folder[0]}>{folder[1]}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          }
      </DialogContent>

      <DialogActions>
        
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cerrar
        </Button>

        <Button variant="contained" color="primary" onClick={handleMoveToFolder} disabled={enableButton}> 
          Mover a carpeta
        </Button>

      </DialogActions>
    </Dialog>
  )
}

export default AddFileToFolder