// MUI
import { 
    Container,
    Typography, 
    Box, 
    Paper, 
    Stack, 
    Button, 
    Fab,
    MenuItem, 
    Menu, 
} from "@mui/material"

import { hideScrollbarY } from "src/utils/cssStyles";
// Components
import TranscriptionOutput from "./TranscriptionOutput"
import ChangeProjectTitleDialog from "src/components/content-builder/ChangeProjectTitleDialog";

// Icons
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// other
import { useState, useRef, useEffect } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import { DB } from "src/auth/FirebaseContext";
import { useAuthContext } from "src/auth/useAuthContext";
import Router, { useRouter } from "next/router";

// types
import { ITranscription } from "src/@types/transcription";

// ----------------------------------------------------------------------

function Transcription({
    form_input, 
    id, 
    project_title,
    state
}: ITranscription) {

  const [openDialog, setOpenDialog] = useState(false);
  
  const [loading, setLoading] = useState(false)
  
  const { query } = useRouter()

  const { user }  = useAuthContext()
  
  const [title, setTitle] = useState(project_title)

    useEffect(() => {
        setTitle(project_title)
    }, [id, query])

    // Update project's title
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    // Update project's title
    const valueRef = useRef<HTMLInputElement>(null)

    async function updateProjectTitle(e:React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        console.log(valueRef.current?.value)

        if (valueRef.current) {
            const value = valueRef.current.value as string
            setTitle(value)
        }
        handleClose()
        if (user) {
        const docRef = doc(DB, "users", user.uid, "documents", id)
        await updateDoc(docRef, {
            project_title: valueRef.current?.value
        })
        }
    }

    // Delete project
    const [anchorElUser, setAnchorElUser] = useState<Element | ((element: Element) => Element) | null>(null);


    const handleOpenUserMenu = (event:React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    async function deleteProject(e:React.MouseEvent<HTMLElement>) {
        e.stopPropagation();
        setLoading(true)
        if (user) {
          const docRef = doc(DB, "users", user.uid, "transcriptions", id)
          await deleteDoc(docRef)
          Router.push('/')
        }
    }

    if (state === 'waiting') return (
        <Container
            sx={{ 
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Stack>
                <h2>El archivo se esta procesando, porfavor regresa en unos minutos...</h2>
                <Button href='/' variant='outlined' sx={{ py: 1 }}>Regresar al home</Button>
            </Stack>
        </Container>
    )

  return (
    <>
        {/* Change title dialog */}
        <ChangeProjectTitleDialog 
            open={openDialog}  
            handleClose={handleClose} 
            title={title} 
            valueRef={valueRef} 
            updateProjectTitle={updateProjectTitle}
        />

        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'scroll',
                ...hideScrollbarY
            }}
        >
            <Box
                sx={{
                    alignSelf: 'center',
                    width: '90%',
                    mt: {lg: 0, xs: -3}
                }}
            >
                <Stack
                    direction='row'
                    spacing={2}
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{mt: {lg: 0, xs: '4rem'}, mb: 3}}
                >
                    <Stack
                        direction='row'
                        spacing={2}
                        alignItems='center'
                    >
                        <Fab
                            size="small"
                            onClick={() => {Router.push("/")}}
                            color='secondary'
                            variant="soft"
                            sx={{ minWidth: 40}}
                        >
                            <ChevronLeftIcon fontSize='small'/>
                        </Fab>
                        <Typography variant='h4' align='left' gutterBottom sx={{mb: '1rem'}}>
                            {title}
                        </Typography>
                    </Stack>
                    
                    <Stack
                        direction={{xs: 'column', md: 'row'}}
                        spacing={1}
                    >
                    <Button
                        variant='contained'
                        sx={{p: '1rem', boxShadow: 'none'}}
                        onClick={handleClickOpen}
                        color='secondary'
                    >
                        <CreateIcon />
                    </Button>
                    <Button
                        variant='contained'
                        sx={{p: '1rem', boxShadow: 'none'}}
                        onClick={handleOpenUserMenu}
                        color='error'
                    >
                        <DeleteOutlineIcon />
                    </Button>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        >
                       
                        <MenuItem
                            onClick={deleteProject}
                        >
                        <HighlightOffIcon color='error' sx={{mr: '0.5rem'}} />
                        <Typography>Eliminar transcripción</Typography>
                        </MenuItem>
                    </Menu>
                    </Stack>
                </Stack>
                
            </Box>
            
            <Paper
                sx={{
                    alignSelf: 'center',
                    width: '90%',
                    p: '2rem',
                }}
            >
                <Box
                    component="form"
                    autoComplete="off"
                    sx={{
                        width: '100%'
                    }}
                >
                    {/* Transcripted textbox */}
                    <TranscriptionOutput 
                        defaultValue={form_input}
                        id={id}
                    />

                </Box>
            </Paper>
            
        </Box>
    </>
  )
}

export default Transcription