import { Stack, Avatar, Typography } from '@mui/material'

type VehicleItemListProps = {
    vehicleType?: string
    vehicleBrand?: string
    vehicleLicensePlate?: string
    vehicleColor?: string
    vehicleParkingLot?: string
}

// ----------------------------------------

export const VehicleDrawerTemplate = (vehicle: VehicleItemListProps) => {

    const { vehicleType, vehicleBrand, vehicleLicensePlate, vehicleColor, vehicleParkingLot } = vehicle;
    
    const vehiclePhotoUrl = (type: string) => {
        if (type === 'Carro') {
            return '/assets/illustrations/car.png'
        } else if (type === 'Moto') {
            return '/assets/illustrations/motorbike.png'
        } else {
            return '/assets/illustrations/bike.png'
        }
    }

    return (
      <>
        <Typography variant='subtitle2'>
          Datos del vehículo
        </Typography>
        <Stack 
          direction="row" 
          justifyContent='space-between' 
          alignItems='center'
        >
          <Stack direction="row" gap={1.5} alignItems='center'>
            {!!vehicleType && <Avatar 
              src={vehiclePhotoUrl(vehicleType)}
              variant="rounded"
              sx={{width: 60, height: 60 }}
            />}
  
            <Stack>
              <Typography variant='caption'>
                {!!vehicleType && vehicleType} {!!vehicleBrand && vehicleBrand} {!!vehicleColor && `| ${vehicleColor}`}
              </Typography>
  
              <Typography variant='subtitle2' sx={{ maxWidth: 140 }}>
                {!!vehicleLicensePlate && vehicleLicensePlate}
              </Typography>
  
              <Typography variant='caption' sx={{ maxWidth: 140 }}>
                {!!vehicleParkingLot && `PQ provisional: ${vehicleParkingLot}` }
              </Typography>
            </Stack>
        </Stack>
      </Stack>
      </>
    )
  }