// MUI
import { TextField, Box, Button, Paper } from "@mui/material"

// Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// hooks
import useCopyToClipboard from "src/hooks/useCopyToClipboard";
import { useSnackbar } from "src/components/snackbar"
import { useState } from "react";

// <------------------------------------------------> //

type OutputSampleType = {
    defaultValue: string | undefined;
    id: string;
}

export default function TranscriptionOutput({defaultValue, id}:OutputSampleType) {

  const [inputVal, setInputVal] = useState(defaultValue);

  // hooks
  const { copy } = useCopyToClipboard()
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = () => {
    const inputValString = String(inputVal);
    copy(inputValString);
    enqueueSnackbar('Texto copiado al portapapeles');
  }


  return (
    <>
        <Paper
            sx={{
                alignSelf: 'center',
                my: '0.5rem'
            }}    
        >
            <Button 
                fullWidth
                startIcon={<ContentCopyIcon />}
                sx={{p: '1rem 2rem', mb: 2}}
                variant='contained'
                color='secondary'
                onClick={handleCopy}
            >
                Copiar
            </Button>
            <TextField
                multiline
                fullWidth
                defaultValue={defaultValue}
                onChange={(e) => setInputVal(e.target.value)}
            />
        </Paper>
    </>
  )
}