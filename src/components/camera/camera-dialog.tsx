import { 
  forwardRef, 
  useEffect, 
  useState, 
  useRef, 
  Dispatch, 
  SetStateAction 
} from 'react';
// @mui
import { Box, Dialog, Fab, Slide, IconButton, Stack, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
// components
import Iconify from 'src/components/iconify/Iconify';
import { Camera, CameraType } from './Camera';
// styles
import { Wrapper, Control } from './styles';
import { CameraFullScreenImagePreview } from './camera-full-screen-image-preview';
import useResponsive from 'src/hooks/useResponsive';

// ----------------------------------------------------------------------

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type CameraDialogProps = {
  open: boolean
  handleClose: () => void
  setFile: Dispatch<SetStateAction<string | undefined>>
  isIdPicture?: boolean
}

export default function CameraDialog({ open, handleClose, setFile, isIdPicture }: CameraDialogProps) {

  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);
  const camera = useRef<CameraType>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(undefined);

  const isMobile = useResponsive('down', 'sm')

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind == 'videoinput');
      setDevices(videoDevices);
    })();
  });

  const handleChangeFacingCamera = () => {
    if (camera.current) {
      camera.current.switchCamera();
    }
  }

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo);
      setFile(photo)
      setShowImage(true);
    }
  }

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Box sx={{ zIndex: 3, position: 'fixed', top: 10, ml: 2 }}>
          <Fab 
            onClick={handleClose} 
            size='small'
          >
            <Iconify icon='mingcute:close-fill'/>
          </Fab>
        </Box>

        {isIdPicture && <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: isMobile ? 'translate(-50%, -50%) rotate(270deg)' : 'translate(-50%, -50%)',
            zIndex: 2 , // Ensure it's above other content but below controls
          }}
        >
          <Stack alignItems='center'>
            <Iconify icon="fluent-emoji-flat:identification-card" width={280} height={260} color="white" sx={{ opacity: 0.4 }} />
            <Typography textAlign='center'>Coloque el dispositivo en la orientación de la imagen de referencia y este texto.</Typography>
          </Stack>
        </Box>}

        <Box 
          sx={{ 
            zIndex: 3, 
            position: 'fixed',
            top: 10,
            right: 10
          }}
        >
          <select
              onChange={(event) => {
                setActiveDeviceId(event.target.value);
              }}
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </option>
              ))}
          </select>
        </Box>
        <Wrapper>
        {showImage 
          ? 
            <CameraFullScreenImagePreview
              image={image}
              handleNewPic={() => setShowImage(false)}
              handleSavePic={handleClose}
            />
           : 
            <Camera
              ref={camera}
              aspectRatio="cover"
              numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
              videoSourceDeviceId={activeDeviceId}
              errorMessages={{
                noCameraAccessible: 'Dispositivo de cámara no accesible. Por favor, conecta tu cámara o prueba con otro navegador.',
                permissionDenied: 'Permiso denegado. Por favor, actualiza y otorga permisos para la cámara.',
                switchCamera: 'No es posible cambiar a una cámara diferente porque solo hay un dispositivo de video accesible.',
                canvas: 'No se admite lienzo.'
              }}
              videoReadyCallback={() => {
                console.log('Video feed ready.');
              }}
            />
        }

          <Control>
            {/* Useless div to center camera button */}
            <Box sx={{ minWidth: 70, opacity: 0 }}>
              div
            </Box>

            <Fab 
              onClick={handleTakePhoto} 
              color='error'
              sx={{ 
                width: 90, 
                height: 90,
              }}
              disabled={numberOfCameras < 1}
            >
              <Iconify icon='bi:camera-fill' width={40}/>
            </Fab>
      
            {numberOfCameras > 1 &&
              <IconButton>
                <Iconify 
                  icon='ph:camera-rotate-light'
                  width={40}
                  color='white'
                  onClick={handleChangeFacingCamera}
                  sx={{ ml: 2 }}
                />
              </IconButton>
            }
          </Control>
        </Wrapper>
    </Dialog>
    </>
  );
}