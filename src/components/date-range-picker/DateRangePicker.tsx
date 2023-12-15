// @mui
import {
  Paper,
  Stack,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormHelperText,
  Typography
} from '@mui/material';
import { DatePicker, CalendarPicker } from '@mui/x-date-pickers';
// hooks
import useResponsive from '../../hooks/useResponsive';
//
import { DateRangePickerProps } from './types';

// ----------------------------------------------------------------------

export default function DateRangePicker({
  title = 'Selecciona una fecha',
  variant = 'input',
  //
  startDate,
  endDate,
  //
  onChangeStartDate,
  onChangeEndDate,
  //
  open,
  onClose,
  //
  isError,
}: DateRangePickerProps) {
  const isDesktop = useResponsive('up', 'md');

  const isCalendarView = variant === 'calendar';

  return (
    <Dialog
      fullWidth
      maxWidth={isCalendarView ? false : 'xs'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...(isCalendarView && {
            maxWidth: 720,
          }),
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent
        sx={{
          ...(isCalendarView &&
            isDesktop && {
              overflow: 'unset',
            }),
        }}
      >
        <Stack
          spacing={isCalendarView ? 3 : 2}
          direction={isCalendarView && isDesktop ? 'row' : 'column'}
          justifyContent="center"
          sx={{
            pt: 1,
            '& .MuiCalendarPicker-root': {
              ...(!isDesktop && {
                width: 'auto',
              }),
            },
          }}
        >
          {isCalendarView ? (
            <> 
              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
              >
                <Typography variant='body1' sx={{py: 2, ml: 3}} >Fecha de inicio</Typography>
                <CalendarPicker date={startDate} onChange={onChangeStartDate} />
              </Paper>

              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
              >
                <Typography variant='body1' sx={{py: 2, ml: 3}} >Fecha de término</Typography>
                <CalendarPicker date={endDate} onChange={onChangeEndDate} />
              </Paper>
            </>
          ) : (
            <>
              <DatePicker
                label="Start date"
                value={startDate}
                onChange={onChangeStartDate}
                renderInput={(params) => <TextField {...params} />}
              />

              <DatePicker
                label="End date"
                value={endDate}
                onChange={onChangeEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </>
          )}
        </Stack>

        {isError && (
          <FormHelperText error sx={{ px: 2, fontSize: 14 }}>
            La fecha de término debe ser despúes de la fecha de inicio
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancelar
        </Button>

        <Button disabled={isError} variant="contained" onClick={onClose}>
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
