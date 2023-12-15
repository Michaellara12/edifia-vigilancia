import { useCallback } from "react";
// MUI
import { Button, Stack, Paper  } from "@mui/material"
// hooks
import { useSnackbar } from "src/components/snackbar"
import { useState } from "react";
// firebase
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuthContext } from "src/auth/useAuthContext";
import { DB } from "src/auth/FirebaseContext";
//
import Editor from "../editor/Editor";
// Icons
import Iconify from "../iconify/Iconify";

// ------------------------------------------------

type OutputSampleType = {
    defaultValue: string
    outputId: string
    proyectoId: string
}

// ------------------------------------------------

export default function GptOutputTextEditor({defaultValue, outputId, proyectoId}:OutputSampleType) {

  const [inputVal, setInputVal] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  // hooks
  const { user } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
    setLoading(true)
    try {
      const docRef = doc(DB, "users", user?.uid, "documents", proyectoId, "gptOutputs", outputId);
      await updateDoc(docRef, {
        outputText: inputVal
      })
      enqueueSnackbar('Los cambios se guardaron');
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    }
    setLoading(false)
  }

  const deleteOutput = async () => {
    try {
      const docRef = doc(DB, "users", user?.uid, "documents", proyectoId, "gptOutputs", outputId);
      await deleteDoc(docRef)
      enqueueSnackbar('Documento eliminado', { variant: 'warning' } );
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    }
  }

  const handleChangeMessage = useCallback((value: string) => {
    setInputVal(value);
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Editor
        id={outputId}
        simple
        value={inputVal}
        onChange={handleChangeMessage}
        placeholder="Texto generado con Inteligencia artificial"
      />
        <Stack
          direction={{lg: 'row', xs: 'column'}}
          spacing={2}
          sx={{ mt: '1rem'}}
        >   
          <Button 
            startIcon={<Iconify icon='bx:save'/>}
            variant='contained'
            color='success'
            onClick={handleSave}
            disabled={loading}
          >
            Guardar cambios
          </Button>
          <Button 
            startIcon={<Iconify icon='iconamoon:trash-fill'/>}
            variant='outlined'
            color='error'
            onClick={deleteOutput}
            disabled={loading}
          >
            Eliminar
          </Button>
        </Stack>
    </Paper>
  )
}