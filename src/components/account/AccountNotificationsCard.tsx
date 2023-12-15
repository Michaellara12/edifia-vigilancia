import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Button,
  Card,
  Backdrop,
  CardContent,
  CardHeader,
  Switch,
  Divider,
  Skeleton
} from '@mui/material';
// Firebase
import { useAuthContext } from 'src/auth/useAuthContext';  
import { getMessaging, getToken } from "firebase/messaging";
import { DB } from 'src/auth/FirebaseContext'; 
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc,
  query,
  getDocs,
  setDoc,
  where
} from 'firebase/firestore';
import { FIREBASE_VAPID_KEY } from 'src/config-global';
import firebase from 'firebase/compat';
// hooks
import { useSnackbar } from "src/components/snackbar";
import useResponsive from 'src/hooks/useResponsive';
// components
import { ActivateNotificationsDialog } from '../dialog';
//
import { v4 as uuidv4 } from 'uuid';
import UAParser from 'ua-parser-js';
import Iconify from '../iconify/Iconify';

type DeviceProps = {
  creationDate: firebase.firestore.Timestamp;
  deviceName: string;
  fcmToken: string;
  notificationsActive: boolean;
  id: string;
}

export default function AccountNotificationsCard() {

  const { user } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar()
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const isMobile = useResponsive('down', 'sm');
  const [noDevicesFound, setNoDevicesFound] = useState(false);
  const [devices, setDevices] = useState<DeviceProps[] | []>([]);
  const collectionRef = collection(DB, 'users', user?.uid, 'notificationDevices');

  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      if (querySnapshot.empty) {
        setNoDevicesFound(true);
        setLoading(false);
      } else {
        const deviceData = querySnapshot.docs.map((doc) => doc.data());
        setDevices(deviceData as DeviceProps[]);
        setLoading(false);
      }
    }, (error) => {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      setLoading(false);
    });
  
    return () => unsubscribe();
  
  }, []);  

  const parser = new UAParser();
  const deviceDetails = `${parser.getOS().name} ${parser.getOS().version} | ${parser.getBrowser().name}`

  // Save fcm token in user's firestore collection
  async function saveFcmToken(token: string) {
    try {
      const collectionRef = collection(DB, 'users', user?.uid, 'notificationDevices');
      const q = query(collectionRef, where('fcmToken', '==', token));
      const querySnapshot = await getDocs(q);
            
        // Checks whether the fcm token from the device already exists
        if (querySnapshot.empty) {
              
          const docId = uuidv4(); // generate a new UUID
        
          await setDoc(doc(collectionRef, docId), {
            creationDate: new Date(),
            deviceName: deviceDetails,
            fcmToken: token,
            id: docId,
            notificationsActive: true
          });
        
          enqueueSnackbar(`Nuevo dispositivo registrado como: ${deviceDetails}`);
          handleCloseBackdrop()
          router.reload() // reloads page to showcase the new device added
        } else {
          // The device has been registered already
          enqueueSnackbar(`Este dispositivo ya esta registrado como: ${deviceDetails}`, { variant: 'info' });
          handleCloseBackdrop()
        }
            
        } catch (error) {
          enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
          handleCloseBackdrop()
        }
  }

  async function getFcmToken() {

    // FCM Messaging object
    const messaging = getMessaging();

    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      enqueueSnackbar(`Este navegador o dispositivo no admite notificaciones, por favor usa otro navegador como: Chrome, Mozilla, etc.`, { variant: 'error' });
      handleCloseBackdrop();
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, request firebase cloud messaging token
      const fcm_token = await getToken(messaging, {
          vapidKey: FIREBASE_VAPID_KEY,
      });
      if (fcm_token) {
        saveFcmToken(fcm_token)
      } else {
        enqueueSnackbar(`Oops parece que tu navegador no admite notificaciones, por favor usa otro navegador como: Chrome, Mozilla, etc.`, { variant: 'error' });
        handleCloseBackdrop();
      }
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission()
        .then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          getToken(messaging, {
            vapidKey: FIREBASE_VAPID_KEY,
          })
            .then((fcm_token) => {
              saveFcmToken(fcm_token)
            })
            .catch((error) => {
              enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
              handleCloseBackdrop();
            })
        // if user rejects permisison
        } else {
          handleOpenDialog()
          handleCloseBackdrop();
        }
        })
        .catch((error) => {
          enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
          handleCloseBackdrop();
        });
    // if notifications permission is denied
    } else if (Notification.permission === "denied") {
      handleOpenDialog()
      handleCloseBackdrop();
    }

    return null
  }

  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
    getFcmToken()
  }

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  if (loading) return (<LoadingNotificationsData />);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <Stack gap={1} sx={{ width: 480, px: 4 }}>
          <Iconify icon='octicon:arrow-up-left-16' width={36} />

          <Typography variant='h3'>
            Permitir micrófono
          </Typography>

          <Typography variant='body2'>
            Para grabar mensajes de voz, haz click en "permitir" que se encuentra arriba a fin de darle a 
            Edifia permiso para acceder al micrófono de tu dispositivo.
          </Typography>

          <Button
            onClick={handleCloseBackdrop}
            variant='contained'
            sx={{ width: 12 }}
          >
            OK
          </Button>
        </Stack>
        
      </Backdrop>

      {/* Notifications denied by user dialog */}
      <ActivateNotificationsDialog 
        title='Permitir micrófono'
        open={openDialog} 
        onClose={handleCloseDialog} 
      />

      <Card sx={{ mt: 4 }} >
        {isMobile
          ?
            <Stack sx={{ p: 2 }}>
              <Typography variant='subtitle1' >
                Gestionar notificaciones
              </Typography>

              <Typography variant='body2' >
                Administra las notificaciones en todos tus dispositivos registrados
              </Typography>

              <Button
                  variant='contained'
                  startIcon={<Iconify icon='tabler:bell-ringing-filled' />}
                  sx={{ mt: 1 }}
                  onClick={handleOpenBackdrop}
              >
                Activar notificaciones
              </Button>
            </Stack>
          :
            <CardHeader
              subheader="Administra las notificaciones en todos tus dispositivos registrados"
              title="Gestionar notificaciones"
              sx={{
                mb: '1.6rem'
              }}
              action={
                <Button
                  variant='contained'
                  startIcon={<Iconify icon='tabler:bell-ringing-filled' />}
                  onClick={handleOpenBackdrop}
                >
                  Activar notificaciones
                </Button>
              }
            />
        }
        <Divider />
        <CardContent>
            <Box
                sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
              {noDevicesFound
                ?
                  <NoDevicesAvailable />
                :
                  <Stack 
                    sx={{ width: '100%' }} 
                    gap={2} 
                    divider={<Divider />}
                  >
                    {devices.map(device => (<Device key={device.fcmToken} device={device}/>))}
                  </Stack>
              }
                
            </Box>
        </CardContent>
      </Card>
    </>
  );
};

const NoDevicesAvailable = () => {
  return (
    <Stack direction='row' gap={2}>
      <Avatar>
        <Iconify icon='fa6-solid:bell-slash' />
      </Avatar>
      <Typography variant='body2' >
        Parece que aún no has activado las notificaciones en ningún dispositivo, 
				haz click en el boton 'Activar notificaciones' para recibir notificaciones 
				de nuevos mensajes en este dispositivo.
      </Typography>
    </Stack>
  )
}

type DeviceItemProps = {
  device: DeviceProps;
}

const Device = ({ device }: DeviceItemProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext()

  const handleSwitchChange = async () => {
    try {
      const docRef = doc(DB, 'users', user?.uid, 'notificationDevices', device.id)
      await updateDoc(docRef, {
        notificationsActive: !device.notificationsActive
      })
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' })
    }
  }

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Stack>
        <Typography variant='subtitle1'>
          {device.deviceName}
        </Typography>

        <Typography variant='caption' >
          {device.creationDate.toDate().toLocaleDateString()}
        </Typography>
      </Stack>

      <Switch checked={device.notificationsActive} onClick={handleSwitchChange}/>
    </Box>
  )
}

const LoadingNotificationsData = () => {
  return (
    <Card sx={{ mt: 4 }} >
      <Stack sx={{ width: '100%', p: 2 }} gap={1} >
        <Skeleton />
        <Skeleton />
        <Skeleton height={64} />
      </Stack>
    </Card>
  )
}