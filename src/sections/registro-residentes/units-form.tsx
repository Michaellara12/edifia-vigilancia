import { Stack, Box, Typography, Card, MenuItem } from '@mui/material';
import { RHFTextField, RHFSelect } from 'src/components/hook-form';
import useResponsive from 'src/hooks/useResponsive';

// --------------------------------------------

export default function UnitsForm() {

  const isMobile = useResponsive('down', 'sm');

  return (
    <>
      {!isMobile && <Stack sx={{ width: '100%' }} alignItems='flex-end'>
        <Box 
          sx={{ 
            maxWidth: {xs: 120, md: 140}, 
            zIndex: 2, 
            p: 1 
          }}>
            <img src='/assets/illustrations/casa-mini.png'/>
        </Box>
      </Stack>}

      <Card sx={{ p: 3, mt: {xs: 2, sm: -12} }}>
        <Stack gap={2}>
              <Stack sx={{ width: {xs: '100%', sm: '80%', md: '85%'} }}>
                <Typography variant='subtitle1'>Información de la unidad</Typography>
                <Typography variant='body2'>
                  Por favor agrega el coeficiente de la unidad, 
                  El coeficiente de propiedad horizontal es un valor 
                  que se asigna a cada unidad privada de un edificio o conjunto residencial. 
                  Este coeficiente determina la participación de cada propietario en los gastos 
                  comunes y en la toma de decisiones de la copropiedad
                </Typography>
              </Stack>

            <Stack 
              direction={{xs: 'column', sm: 'row'}} 
              gap={2} 
            >
              <RHFSelect
                name='type'
              >
                <MenuItem
                  value="Apartamento"
                >
                  🏬 Apartamento
                </MenuItem>

                <MenuItem
                  value="Casa"
                >
                  🏡 Casa
                </MenuItem>
              </RHFSelect>
              <RHFTextField 
                name="tower" 
                label="Torre" 
                placeholder='2'
              />

              <RHFTextField 
                name="unit" 
                label="Unidad" 
                placeholder='102'
              />

              <RHFTextField
                name="coef"
                label="Coeficiente"
                placeholder='0.92'
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField 
                name="parkingLot" 
                label="Número parqueadero principal" 
              />

              <RHFTextField 
                name="secondParkingLot" 
                label="Número parqueadero secundario" 
              />

              <RHFTextField
                name="deposit"
                label="Número depósito principal"
              />

              <RHFTextField
                name="secondDeposit"
                label="Número depósito secundario"
              />
            </Stack>

        </Stack>
      </Card>
    </>
  );
};