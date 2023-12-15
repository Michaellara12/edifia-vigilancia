import { useState, useEffect } from 'react';
// @mui
import { Stack, Typography, Skeleton, Button } from '@mui/material';
//
import Iconify from 'src/components/iconify/Iconify';
import { useSnackbar } from "src/components/snackbar";
// firebase
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
import { DB } from 'src/auth/FirebaseContext';


// -------------------------------------------------------------

type ParkingProps = {
  arrivalDate: Timestamp;
  vehicleType: string;
  visitorId: string;
  onClose: () => void;
};

type ParkingCostType = {
  carHours: number;
  motoHours: number;
  freeHours: number;
};

// -------------------------------------------------------------

export function ParkingManager({ arrivalDate, vehicleType, visitorId, onClose }: ParkingProps) {

  const { enqueueSnackbar } = useSnackbar()

  const [isLoading, setIsLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchAndCalculate = async () => {
      const parkingCost = await fetchParkingCost();
      if (parkingCost) {
        calculateCost(parkingCost);
        startTimer(parkingCost);
      }
    };

    fetchAndCalculate();
  }, [arrivalDate, vehicleType]);

  const fetchParkingCost = async (): Promise<ParkingCostType | null> => {
    const docRef = doc(DB, 'users', user?.uid);
    const docData = await getDoc(docRef);
    if (docData.exists()) {
      const data = docData.data();
      return {
        carHours: data.carHours || 0,
        motoHours: data.motoHours || 0,
        freeHours: data.freeHours || 0,
      };
    }
    return null;
  };

  const startTimer = (parkingCost: ParkingCostType) => {
    updateElapsedTime(); // Initial update
    const interval = setInterval(() => {
      updateElapsedTime();
    }, 1000);

    return () => clearInterval(interval);
  };

  const updateElapsedTime = () => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - arrivalDate.toMillis();
    setElapsedTime(timeDifference);
    if (isLoading) {
      setIsLoading(false); // Stop loading after the first update
    }
  };

  const calculateCost = (parkingCost: ParkingCostType) => {
    const now = Timestamp.now().toDate();
    const arrival = arrivalDate.toDate();
    const diffHours = Math.max(0, (now.getTime() - arrival.getTime()) / 3600000);
    const finalHours = diffHours - parkingCost.freeHours;

    let costPerHour = vehicleType === 'Carro' ? parkingCost.carHours : parkingCost.motoHours;
    setEstimatedCost(Math.max(0, finalHours * costPerHour));
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleAuthExit = async () => {
    try {
      const docRef = doc(DB, 'basic-crm', user?.uid, 'visitors', visitorId);
      const seconds = Math.floor(elapsedTime / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      // convert time elapsed to string
      const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        remainingSeconds.toString().padStart(2, '0')
      ].join(':');

      const obj = {
        exitDate: new Date(),
        parkingTime: formattedTime,
        parkingCost: estimatedCost ? Math.floor(estimatedCost) : 0
      };
      await updateDoc(docRef, obj);  
      enqueueSnackbar('Se autorizó la salida con exito');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    onClose();
  }


  if (isLoading) {
    return <Skeleton variant="text" width={100} height={40} />;
  }

  return (
    <Stack justifyContent='center'>
      <Stack direction='row' alignItems='center'>
        <Iconify icon='ph:clock-bold' />
        <Typography variant='h3' sx={{ ml: 1 }}>{formatTime(elapsedTime)}</Typography>
      </Stack>
      <Typography variant='caption' alignSelf='center'>Costo estimado:</Typography>
      <Typography variant='h5' sx={{ ml: 1 }} textAlign='center'>
        💵 ${estimatedCost !== null ? estimatedCost.toFixed(2) : '0'}
      </Typography>

      <Button 
        variant='contained'
        color='warning'
        startIcon={<Iconify icon='tabler:door-exit'/>}
        onClick={handleAuthExit}
      >
        Autorizar salida
      </Button>
    </Stack>
  );
}
