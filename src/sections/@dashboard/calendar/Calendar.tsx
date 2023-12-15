import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { EventInput } from '@fullcalendar/core'
//
import { useState, useRef, useEffect } from 'react';
// next
import Head from 'next/head';
// @mui
import { Box, LinearProgress, Card, Button, Container, DialogTitle, Dialog } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import {
  selectEvent,
  selectRange,
  onOpenModal,
  onCloseModal,
} from 'src/redux/slices/calendar';
import { useAuthContext } from 'src/auth/useAuthContext';
import { DB } from 'src/auth/FirebaseContext';
import { collection, onSnapshot, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
// utils
import { fTimestamp } from 'src/utils/formatTime';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// @types
import { ICalendarEvent, ICalendarViewValue } from 'src/@types/calendar';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { useDateRangePicker } from 'src/components/date-range-picker';
import { v4 as uuidv4 } from 'uuid';
// sections
import {
  CalendarForm,
  StyledCalendar,
  CalendarToolbar,
  CalendarFilterDrawer,
} from 'src/sections/@dashboard/calendar';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

// ----------------------------------------------------------------------

export default function Calendar() {
  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettingsContext();

  const { user } = useAuthContext();

  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef<FullCalendar>(null);

  const [events, setEvents] = useState<EventInput[] | []>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    const collectionRef = collection(DB, 'users', user?.uid, 'calendar');
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      if (querySnapshot.empty) {
        setEvents([]);
        setLoading(false);
      } else {
        const items = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            start: doc.data().start.toDate().getTime(),
            end: doc.data().end.toDate().getTime()
          } as EventInput;
        });
        setEvents(items as EventInput[]);
        setLoading(false);
      }
    }, (error) => {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      setLoading(false);
    });
  
    return () => unsubscribe();
  
  }, []);

  const { openModal, selectedRange, selectedEventId } = useSelector(
    (state) => state.calendar
  );

  const selectedEvent = useSelector(() => {
    if (selectedEventId) {
      return events.find((event) => event.id === selectedEventId);
    }

    return null;
  });

  const picker = useDateRangePicker(null, null);

  const [date, setDate] = useState(new Date());

  const [openFilter, setOpenFilter] = useState(false);

  const [filterEventColor, setFilterEventColor] = useState<string[]>([]);

  const [view, setView] = useState<ICalendarViewValue>(isDesktop ? 'dayGridMonth' : 'listWeek');

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView: ICalendarViewValue) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg: DateSelectArg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(
      selectRange({
        start: arg.start,
        end: arg.end,
      })
    );
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleResizeEvent = async ({ event }: EventResizeDoneArg) => {
    try {
      if (event.id && event.start && event.end) {
        const docRef = doc(DB, 'users', user?.uid, 'calendar', event.id);
        await updateDoc(docRef, {
          id: event.id,
          allData: event.allDay,
          description: event.extendedProps.description,
          title: event.title,
          textColor: event.textColor,
          start: new Date(event.start),
          end: new Date(event.end)
        })
        enqueueSnackbar('Evento actualizado');
      } else {
        enqueueSnackbar('No fue posible mover este evento', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'warning' });
    }
  };

  const handleDropEvent = async ({ event }: EventDropArg) => {
    try {
      if (event.id && event.start && event.end) {
        const docRef = doc(DB, 'users', user?.uid, 'calendar', event.id);
        await updateDoc(docRef, {
          id: event.id,
          allData: event.allDay,
          description: event.extendedProps.description,
          title: event.title,
          textColor: event.textColor,
          start: new Date(event.start),
          end: new Date(event.end)
        })
        enqueueSnackbar('Evento actualizado');
      } else {
        enqueueSnackbar('No fue posible mover este evento', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'warning' });
    }
  };

  const handleOpenModal = () => {
    dispatch(onOpenModal());
  };

  const handleCloseModal = () => {
    dispatch(onCloseModal());
  };

  const handleCreateUpdateEvent = async (newEvent: ICalendarEvent) => {
    try {
      if (selectedEventId && newEvent.start && newEvent.end) {
        const docRef = doc(DB, 'users', user?.uid, 'calendar', selectedEventId);
        await updateDoc(docRef, {
          ...newEvent,
          start: new Date(newEvent.start),
          end: new Date(newEvent.end)
        })
        enqueueSnackbar('Evento actualizado');
      } else {
        const newDocId = uuidv4()
        const docRef = doc(DB, 'users', user?.uid, 'calendar', newDocId);
        await setDoc(docRef, {
          id: newDocId,
          ...newEvent
        })
        enqueueSnackbar('Evento registrado');
      }
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'warning' });
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (selectedEventId) {
        const docRef = doc(DB, 'users', user?.uid, 'calendar', selectedEventId);
        await deleteDoc(docRef)
        handleCloseModal();
        enqueueSnackbar('Evento eliminado', { variant: 'warning' });
      }
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'warning' });
    }
  };

  const handleFilterEventColor = (eventColor: string) => {
    const checked = filterEventColor.includes(eventColor)
      ? filterEventColor.filter((value) => value !== eventColor)
      : [...filterEventColor, eventColor];

    setFilterEventColor(checked);
  };

  const dataFiltered = applyFilter({
    inputData: events,
    filterEventColor,
    filterStartDate: picker.startDate,
    filterEndDate: picker.endDate,
    isError: !!picker.isError,
  });

  if (loading) {
    return (
      <Container maxWidth={themeStretch ? false : 'xl'} sx={{overflow: 'hidden'}}>
        <Card sx={{ height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{width:'30%'}}>
            <LinearProgress />
          </Box>
        </Card>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title> Calendario | Edifia AI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Calendario"
          links={[
            {
              name: '',
            },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenModal}
            >
              Registrar evento
            </Button>
          }
        />

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
              onOpenFilter={handleOpenFilter}
            />
            <FullCalendar
              weekends
              editable
              droppable
              selectable
              allDayMaintainDuration
              eventResizableFromStart
              events={dataFiltered}
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              select={handleSelectRange}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
              height={isDesktop ? 720 : 'auto'}
              locale='es'
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>

      <Dialog fullWidth maxWidth="xs" open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{selectedEvent ? 'Editar evento' : 'Agregar evento'}</DialogTitle>

        <CalendarForm
          event={selectedEvent}
          range={selectedRange}
          onCancel={handleCloseModal}
          onCreateUpdateEvent={handleCreateUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          colorOptions={COLOR_OPTIONS}
        />
      </Dialog>

      <CalendarFilterDrawer
        events={events}
        picker={picker}
        open={openFilter}
        onClose={handleCloseFilter}
        colorOptions={COLOR_OPTIONS}
        filterEventColor={filterEventColor}
        onFilterEventColor={handleFilterEventColor}
        onResetFilter={() => {
          const { setStartDate, setEndDate } = picker;
          setFilterEventColor([]);
          if (setStartDate && setEndDate) {
            setStartDate(null);
            setEndDate(null);
          }
        }}
        onSelectEvent={(eventId: string) => {
          if (eventId) {
            handleOpenModal();
            dispatch(selectEvent(eventId));
          }
        }}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filterEventColor,
  filterStartDate,
  filterEndDate,
  isError,
}: {
  inputData: EventInput[];
  filterEventColor: string[];
  filterStartDate: Date | null;
  filterEndDate: Date | null;
  isError: boolean;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterEventColor.length) {
    inputData = inputData.filter((event: EventInput) =>
      filterEventColor.includes(event.textColor as string)
    );
  }

  if (filterStartDate && filterEndDate && !isError) {
    inputData = inputData.filter(
      (event: EventInput) =>
        fTimestamp(event.start as Date) >= fTimestamp(filterStartDate) &&
        fTimestamp(event.end as Date) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}