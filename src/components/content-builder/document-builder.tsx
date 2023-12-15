// MUI
import { 
  Typography, 
  Box, 
  TextField, 
  Paper, 
  Stack, 
  Button, 
  useTheme, 
  Container,
  Divider, 
} from "@mui/material"
// Components
import DocumentTitleHeader from "src/sections/@dashboard/templates/document-title-header";
import GptOutputTextEditor from './gpt-output-text-editor'
import ToneFormSelector from "./form-options/ToneFormSelector"
import TemplateSelector from "./form-options/TemplateSelector";
import LoadingGptData from "./LoadingGptData";
// Icons
import CreateIcon from '@mui/icons-material/Create';
// other
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuthContext } from "src/auth/useAuthContext";
import { useRouter } from "next/router";
// types
import { IDocumentBuilder } from 'src/@types/document'
import { SelectChangeEvent } from "@mui/material";

// ----------------------------------------------------------------------

export default function DocumentBuilder({form_input, gptOutputs, proyectoId, projectTitle}: IDocumentBuilder) {
  
  const [loading, setLoading] = useState(false)
  
  const [tono, setTono] = useState("Neutro")

  const [prompt, setPrompt] = useState(form_input)
  
  const [title, setTitle] = useState(projectTitle)

  const [templateSelected, setTemplateSelected] = useState('documento')

  const { query } = useRouter()

  const theme = useTheme()
  
  const { user }  = useAuthContext()

    useEffect(() => {
      setLoading(false)
    }, [gptOutputs])

    useEffect(() => {
        setTitle(projectTitle)
    }, [proyectoId, query])

    function gptRequest(e:React.MouseEvent<HTMLElement>) {
      e.preventDefault()
      setLoading(true)
      if (user) {
        axios.post("https://hook.us1.make.com/1s953rwrba454n3gk1tp8l3wlm9zbae1", {
          proyectoId: proyectoId,
          prompt: prompt,
          userId: user.uid,
          userEmail: user.email,
          tono: tono,
          tipo: templateSelected,
          dateCreated: new Date(),
          dateModified: new Date()
        })
          .then(function (response) {
              console.log('prompt enviado')
          })
          .catch(function (error) {
              console.log(error)
          })
      }
    }

  // Tone
  const handleSelectFormChange = (event:SelectChangeEvent<string>) => {
    setTono(event.target.value);
  };

   // Template
   const handleSelectTemplate = (event:SelectChangeEvent<string>) => {
    setTemplateSelected(event.target.value);
   };

  return (
    <Container maxWidth='md'>
        <Stack alignItems='center' gap={2}>
          <DocumentTitleHeader 
            currentTitle={title} 
            documentId={proyectoId}
          />
          <Paper sx={{ width: '100%', p: 2 }}>
          <Stack spacing={2}>
            <Stack
              direction='row'
              spacing={1}
              alignItems='center'                    
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                  height: '2rem',
                  width: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: theme.customShadows.primary,
                  p: '1rem'
                }}
              >
                <CreateIcon sx={{color: '#FFF'}} fontSize="small"/>
              </Box>

                    <Typography>
                        Agrega información relevante para la redacción del documento.
                    </Typography>
                </Stack>
                <Box
                    component="form"
                    autoComplete="off"
                    sx={{
                        width: '100%'
                    }}
                >
                    <TextField
                        id="outlined-textarea"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        multiline
                        sx={{
                            width: '100%',
                        }}
                        placeholder="Agrega instrucciones o información detallada o relevante para la redacción del documento."
                    />
                </Box>

                {/* Form options */}
                <ToneFormSelector val={tono} handleSelectFormChange={handleSelectFormChange}/>

                {/* Template selector */}
                <TemplateSelector val={templateSelected} handleSelectFormChange={handleSelectTemplate}/>
       
                <Button
                    variant="contained"
                    sx={{p: '1rem 2rem'}}
                    onClick={gptRequest}
                    disabled={loading}
                >
                    Crear documento
                </Button>
            </Stack>
            </Paper>

            <Divider sx={{ my: 2 }}/>
            
            {loading
              ?
                <LoadingGptData />
              :
                gptOutputs.map((gptOutput) => (
                  gptOutput
                    ?
                    <GptOutputTextEditor key={gptOutput.id} outputId={gptOutput.id} defaultValue={gptOutput.outputText} proyectoId={proyectoId}/>
                    :
                    null
                  ))
              }
            
        </Stack>
    </Container>
  )
}