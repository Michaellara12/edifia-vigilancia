// MUI
import { TextField, Box, Button, Stack, Paper  } from "@mui/material"
// Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';

// hooks
import useCopyToClipboard from "src/hooks/useCopyToClipboard";
import { useSnackbar } from "src/components/snackbar"
import { useState } from "react";

// firebase
import { doc, deleteDoc } from 'firebase/firestore';
import { useAuthContext } from "src/auth/useAuthContext";
import { DB } from "src/auth/FirebaseContext";


// <------------------------------------------------> //

type OutputSampleType = {
    defaultValue: string
    outputId: string
    proyectoId: string
}

function GptOutputSample({defaultValue, outputId, proyectoId}:OutputSampleType) {

  const [inputVal, setInputVal] = useState(defaultValue);

  // hooks
  const { user } = useAuthContext()
  const { copy } = useCopyToClipboard()
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = () => {
    const inputValString = String(inputVal);
    copy(inputValString);
    enqueueSnackbar('Texto copiado al portapapeles');
  }


  // Delete output
  const deleteOutput = async (id:string, e:React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (user) {
        const docRef = doc(DB, "users", user.uid, "documents", proyectoId, "gptOutputs", id);
        await deleteDoc(docRef)
    }
  }

  return (
    <>
        <Paper
          sx={{
            alignSelf: 'center',
            width: '100%',
            p: '2rem',
            my: '0.5rem'
          }}    
        >
            <Box
                component="form"
                autoComplete="off"
                sx={{
                    width: '100%'
                }}
                >
                    <TextField
                        multiline
                        sx={{
                            width: '100%',
                        }}
                        defaultValue={defaultValue}
                        onChange={(e) => setInputVal(e.target.value)}
                    />
                    <Stack
                        direction={{lg: 'row', xs: 'column'}}
                        spacing={2}
                        sx={{mt: '1rem'}}
                    >   
                            <Button 
                                startIcon={<ContentCopyIcon />}
                                variant='contained'
                                color='secondary'
                                onClick={handleCopy}
                            >
                                Copiar
                            </Button>
                        <Button 
                            startIcon={<DeleteIcon />}
                            variant='outlined'
                            color='error'
                            onClick={e => deleteOutput(outputId, e)}
                        >
                            Eliminar
                        </Button>
                    
                    </Stack>
            </Box>
        </Paper>
    </>
  )
}

export default GptOutputSample