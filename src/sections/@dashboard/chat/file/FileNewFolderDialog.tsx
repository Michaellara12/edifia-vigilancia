//
import { useEffect, useCallback } from 'react';
// @mui
import {
  Dialog,
  Button,
  TextField,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { Upload } from '../../../../components/upload';
import { hideScrollbarY } from 'src/utils/cssStyles';
// hooks
import { useFileUploaderContext } from 'src/contexts/FileUploaderContext';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  title?: string;
  //
  onCreate?: VoidFunction;
  onUpdate?: VoidFunction;
  //
  folderName?: string;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  open: boolean;
  onClose: VoidFunction;
}

export default function FileNewFolderDialog({
  title = 'Subir archivos',
  open,
  onClose,
  //
  onCreate,
  onUpdate,
  //
  folderName,
  onChangeFolderName,
  ...other
}: Props) {

  const { 
    files,
    setFiles,
    handleUpload,
    handleRemoveFile,
    handleRemoveAllFiles,
    uploadingFiles
  } = useFileUploaderContext()

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {

      const newFiles = acceptedFiles.map((file) => ({
        blob: file,
        state: "queue",
      }));
  
      setFiles([...files, ...newFiles]);
    },
    [files]
  );
  
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={uploadingFiles ? undefined : onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent 
        dividers 
        sx={{ 
          pt: 1, 
          pb: 0, 
          border: 'none',
          ...hideScrollbarY
        }}
      >
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload 
          multiple 
          files={files} 
          onDrop={handleDrop} 
          onRemove={handleRemoveFile} 
          disabled={uploadingFiles}
        />
      </DialogContent>

      <DialogActions>
        {!!files.length && (
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={handleRemoveAllFiles}
            disabled={uploadingFiles}
          >
            Quitar archivos
          </Button>
        )}

        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:send-line" />}
          onClick={handleUpload}
          disabled={files.length === 0 || uploadingFiles}
        >
          {uploadingFiles ? 'Enviando...' : 'Enviar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}