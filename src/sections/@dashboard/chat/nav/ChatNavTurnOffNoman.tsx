import { useRouter } from "next/router";
// react
import { useState } from "react"
// @mui
import { 
    Button, 
    Stack, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton
} from "@mui/material"
// functions
import { httpsCallable } from 'firebase/functions';
import { FUNCTIONS } from "src/auth/FirebaseContext";
// icons
import Iconify from "src/components/iconify/Iconify"
//
import { useSnackbar } from "src/components/snackbar"

// ----------------------------------------------------------------------   

type Props = {
    isLoading: boolean;
}

export default function ChatNavTurnOffNoman({ isLoading }: Props) {

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const { query: { chatroomId } } = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const turnOffNoman = () => {
        setLoading(true)

        const turnOff = httpsCallable(FUNCTIONS, 'turnOffNoman')
        
        turnOff({ chatroomId: chatroomId as string })
            .then((result) => {
                console.log('Function triggered')
                setLoading(false)
                handleClose()
                enqueueSnackbar("Noman desactivado")
            })
            .catch((error) => {
                enqueueSnackbar("No fue posible desactivar Noman", { variant: 'error' });
                handleClose();
            }
        )
    }

    if (isLoading) return <Stack alignItems='center' sx={{ mt: 2 }} ><Skeleton width={200}/></Stack>

    return (
        <>
            <Stack 
                direction='row' 
                alignItems='center' 
                justifyContent='center' 
                gap={2}
                sx={{ mt: 2 }}
            >

                <Button 
                    endIcon={<Iconify icon='mdi:robot-off-outline' width={24} sx={{ color: 'primary.main' }} />}
                    variant='outlined'
                    onClick={handleOpen}
                >
                    Apagar Noman global
                </Button>
                
            </Stack>


            <Dialog open={open} onClose={handleClose}>
            <>
                <DialogTitle>Apagar a Noman en todas las conversaciones</DialogTitle>
                <DialogContent>
                    Noman dejará de comunicarse con TODOS los usuarios. <br/>Puedes encender a Noman manualmente haciendo click en el switch que esta en la parte superior derecha de cada conversación.
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose} 
                        variant='contained'
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={turnOffNoman} 
                        disabled={loading}
                    >
                        Apagar
                    </Button>
                </DialogActions>
            </>
            </Dialog>
        </>
    )
}
