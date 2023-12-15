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
  onCreate?: VoidFunction;
  onUpdate?: VoidFunction;
  //
  folderName?: string;
  folderId?: string;
  setFolderName?: Dispatch<SetStateAction<string>>;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  open: boolean;
  onClose: VoidFunction;
}

export default function FileNewFolderDialog({
  title = 'Upload Files',
  open,
  onClose,
  //
  onCreate,
  onUpdate,
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

  const handleUpload = () => {
    onClose();
    console.log('ON UPLOAD');
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  async function handleCreateFolder() {
    setDisableButton(true)
    if (user && !!setFolderName) {
      const collectionRef = collection(DB, "users", user.uid, "documents")
      await addDoc(collectionRef, {project_title: folderName, tipo: 'folder', dateCreated: new Date(), dateModified: new Date(), files: []})
      onClose();
      setFolderName('')
    }
    setDisableButton(false)
  }

  async function handleUpdate() {
    setDisableButton(true)
    console.log('hi')
    if (user && !!setFolderName && folderId) {
        const docRef = doc(DB, "users", user.uid, "documents", folderId)
        await updateDoc(docRef, {project_title: folderName})
        onClose();
        setFolderName('')
      }
      setDisableButton(false)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Nombre de la carpeta"
            value={folderName}
            onChange={onChangeFolderName}
            disabled={disableButton}
          />
        )}
      </DialogContent>

      <DialogActions>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remover todos
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="contained" onClick={handleCreateFolder || handleUpdate} disabled={disableButton} size="large" startIcon={<FolderOpenIcon />}>
              {onUpdate ? 'Guardar' : 'Crear'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
