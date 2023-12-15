import { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
// @mui
import {
  Stack,
  Dialog,
  Button,
  TextField,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
// 
import { useAuthContext } from 'src/auth/useAuthContext';
import { DB } from 'src/auth/FirebaseContext';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
// icons
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  title?: string;

  //
  folderName?: string;
  folderId?: string;
  setFolderName?: Dispatch<SetStateAction<string>>;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  open: boolean;
  onClose: VoidFunction;
}

export default function FileUpdateFolderDialog({
  title = 'Upload Files',
  open,
  onClose,
  //
  folderName,
  folderId,
  onChangeFolderName,
  setFolderName,
  ...other
}: Props) {
  const [files, setFiles] = useState<(File | string)[]>([]);

  const [disableButton, setDisableButton] = useState(false)

  const { user } = useAuthContext()

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);


  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  async function handleUpdate() {
    setDisableButton(true)
    if (user && folderId) {
        const docRef = doc(DB, "users", user.uid, "documents", folderId)
        await updateDoc(docRef, {project_title: folderName})
        onClose();
      }
      setDisableButton(false)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <TextField
            fullWidth
            label="Nombre de la carpeta"
            value={folderName}
            onChange={onChangeFolderName}
            disabled={disableButton}
          />
      </DialogContent>

      <DialogActions>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remover todos
          </Button>
        )}

          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="contained" onClick={handleUpdate} disabled={disableButton} size="large" startIcon={<FolderOpenIcon />}>
              <Typography>Guardar</Typography>
            </Button>
          </Stack>
      </DialogActions>
    </Dialog>
  );
}
