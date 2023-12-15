// @mui
import { Stack, Button, MenuItem, Typography, IconButton, useTheme } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// @types
import { ICalendarViewValue } from '../../../@types/calendar';
// components
import Iconify from '../../../components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  { value: 'dayGridMonth', label: 'Mes', icon: 'mingcute:calendar-month-line' },
  { value: 'timeGridWeek', label: 'Semana', icon: 'mingcute:calendar-week-line' },
  { value: 'timeGridDay', label: 'Día', icon: 'mingcute:calendar-day-line' },
  { value: 'listWeek', label: 'Agenda', icon: 'fa:book' },
] as const;

// ----------------------------------------------------------------------

type Props = {
  date: Date;
  view: ICalendarViewValue;
  onToday: VoidFunction;
  onNextDate: VoidFunction;
  onPrevDate: VoidFunction;
  onOpenFilter: VoidFunction;
  onChangeView: (newView: ICalendarViewValue) => void;
};

export default function CalendarToolbar({
  date,
  view,
  onToday,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilter,
}: Props) {

  const theme = useTheme()

  const isDesktop = useResponsive('up', 'sm');

  const popover = usePopover();

  const selectedItem = VIEW_OPTIONS.filter((item) => item.value === view)[0];

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 2.5 }}
    >
      {isDesktop && (
        <Button
          size="medium"
          color="inherit"
          onClick={popover.onOpen}
          startIcon={<Iconify icon={selectedItem.icon} sx={{ ml: 1 }}  />}
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" sx={{ ml: 1 }} />}
          sx={{ boxShadow: theme.customShadows.dropdown }}
        >
          {selectedItem.label}
        </Button>
      )}      

      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onPrevDate}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Typography variant="h5">{fDate(date)}</Typography>

        <IconButton onClick={onNextDate}>
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </IconButton>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        {isDesktop && (
          <Button size="small" color="error" variant="contained" onClick={onToday}>
            Hoy
          </Button>
        )}

        <Button 
          onClick={onOpenFilter}
          variant='soft'
          startIcon={
            <Iconify icon="ic:round-filter-list" />
          }
        >
          Filtrar eventos
        </Button>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-left"
        sx={{ width: 160 }}
      >
        {VIEW_OPTIONS.map((viewOption) => (
          <MenuItem
            key={viewOption.value}
            selected={viewOption.value === view}
            onClick={() => {
              popover.onClose();
              onChangeView(viewOption.value);
            }}
          >
            <Iconify icon={viewOption.icon} sx={{ mr: 1 }}  />
            {viewOption.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </Stack>
  );
}
