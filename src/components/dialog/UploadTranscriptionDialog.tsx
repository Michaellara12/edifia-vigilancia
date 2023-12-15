//
import { useEffect, useCallback } from 'react';
// @mui
import {
  Dialog,
  Button,
  DialogProps,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from '@mui/material';
// components
import Iconify from '../iconify';
import { Upload } from '../upload';
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

export default function UploadTranscriptionDialog({
  title,
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
    handleTranscribe,
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
        <Typography variant='body2' sx={{ mb: 2}} >
          Solo puedes subir archivos tipo mp3, mp4, mpeg, mpga, m4a, wav o webm.
        </Typography>
        <Upload 
          accept={{ 'audio/*': ['.mp3', '.mpga', './m4a', './wav'], 'video/*': ['.mp4', '.mpeg', './webm'] }}
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
          startIcon={<Iconify icon="icon-park-outline:upload-one" />}
          onClick={handleTranscribe}
          disabled={files.length === 0 || uploadingFiles}
        >
          {uploadingFiles ? 'Subiendo archivos...' : 'Transcribir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}