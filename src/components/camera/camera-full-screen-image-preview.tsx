import { Box, Button, Stack } from '@mui/material';
import { Control } from './styles';
import Iconify from 'src/components/iconify/Iconify';

// ----------------------------------------------------------------------

type CameraFullScreenImagePreviewProps = {
    image: string | null | undefined
    handleSavePic: () => void
    handleNewPic: () => void
}

export const CameraFullScreenImagePreview = ({ 
    image, 
    handleSavePic, 
    handleNewPic 
}: CameraFullScreenImagePreviewProps) => {

    return (
        <Box 
          sx={{
            width: '100%',
            height: '100%',
            zIndex: 100,
            position: 'absolute',
            backgroundColor: 'black',
            ...(image ? { backgroundImage: `url(${image})` } : {}),
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        }}>
           <Control>
            <Stack direction={{xs: 'column', md: 'row'}} gap={2} sx={{ mb: 2 }}>
                <Button
                    startIcon={<Iconify icon='akar-icons:save' width={22} />}
                    variant='contained'
                    color='success'
                    sx={{ fontSize: 18 }}
                    onClick={handleSavePic}
                >
                    Guardar foto
                </Button>

                <Button
                    startIcon={<Iconify icon='bi:camera-fill' width={22} />}
                    variant='contained'
                    color='info'
                    sx={{ fontSize: 18 }}
                    onClick={handleNewPic}
                >
                    Tomar nueva foto
                </Button>
            </Stack>
             
           </Control>
        </Box>
    )
};