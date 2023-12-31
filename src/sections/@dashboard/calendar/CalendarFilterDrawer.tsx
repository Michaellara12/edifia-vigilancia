import orderBy from 'lodash/orderBy';
import { EventInput } from '@fullcalendar/core';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Stack,
  Drawer,
  Divider,
  Tooltip,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  ListItemButton,
} from '@mui/material';
// config
import { NAV } from '../../../config-global';
// utils
import { fDateTime } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { ColorMultiPicker } from '../../../components/color-utils';
import { DateRangePickerProps } from '../../../components/date-range-picker';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  events: EventInput[];
  onResetFilter: VoidFunction;
  onClose: VoidFunction;
  colorOptions: string[];
  filterEventColor: string[];
  picker: DateRangePickerProps;
  onSelectEvent: (eventId: string) => void;
  onFilterEventColor: (eventColor: string) => void;
};

export default function CalendarFilterDrawer({
  open,
  events,
  picker,
  onClose,
  onResetFilter,
  colorOptions,
  onSelectEvent,
  filterEventColor,
  onFilterEventColor,
}: Props) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: NAV.W_BASE },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pl: 2, pr: 1, py: 2 }}
      >
        <Typography variant="subtitle1">Filtros</Typography>

        <Tooltip title="Eliminar filtros">
          <IconButton onClick={onResetFilter}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider />

      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
          p: (theme) => theme.spacing(2, 2, 1, 2),
        }}
      >
        Colores
      </Typography>

      <ColorMultiPicker
        colors={colorOptions}
        selected={filterEventColor}
        onChangeColor={onFilterEventColor}
        sx={{ maxWidth: 36 * 4, mx: 2 }}
      />

      <Typography
        variant="caption"
        sx={{
          p: 2,
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
        }}
      >
        Rango
      </Typography>

      <Stack spacing={2} sx={{ px: 2 }}>
        <DatePicker
          label="Fecha de inicio"
          value={picker.startDate}
          onChange={picker.onChangeStartDate}
          renderInput={(params) => <TextField size="small" {...params} />}
        />

        <DatePicker
          label="Fecha de finalización"
          value={picker.endDate}
          onChange={picker.onChangeEndDate}
          renderInput={(params) => <TextField size="small" {...params} />}
        />
      </Stack>

      <Typography
        variant="caption"
        sx={{
          p: 2,
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
        }}
      >
        Eventos ({events.length})
      </Typography>

      <Scrollbar sx={{ height: 1 }}>
        {orderBy(events, ['end'], ['desc']).map((event) => (
          <ListItemButton key={event.id} onClick={() => onSelectEvent(event.id as string)}>
            <Box
              sx={{
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                position: 'absolute',
                borderRight: '8px solid transparent',
                borderTop: `8px solid ${event.textColor}`,
              }}
            />

            <ListItemText
              disableTypography
              primary={
                <Typography variant="subtitle2" sx={{ fontSize: 13, mt: 0.5 }}>
                  {event.title}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ fontSize: 11, color: 'text.disabled' }}
                >
                  {event.allDay ? (
                    fDateTime(event.start as Date, 'dd MMM yy')
                  ) : (
                    <>
                      {fDateTime(event.start as Date, 'dd MMM yy p')} {' - '}
                      {fDateTime(event.end as Date, 'dd MMM yy p')}
                    </>
                  )}
                </Typography>
              }
              sx={{ display: 'flex', flexDirection: 'column-reverse' }}
            />
          </ListItemButton>
        ))}
      </Scrollbar>
    </Drawer>
  );
}
