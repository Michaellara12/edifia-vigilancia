import { format, getTime, formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';
import { Timestamp } from 'firebase/firestore';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null;
type dateInputValue = Date | Timestamp | string | number | null;

const locale = es

export function fDate(date: dateInputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  if (date instanceof Timestamp) {
    date = date.toDate();
  } else if (typeof date === 'string') {
    date = new Date(date);
  } else if (typeof date === 'number') {
    date = new Date(date);
  }

  return date ? format(date, fm, { locale }) : '';
}

export function fDateTime(date: dateInputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  if (date instanceof Timestamp) {
    date = date.toDate();
  } else if (typeof date === 'string') {
    date = new Date(date);
  } else if (typeof date === 'number') {
    date = new Date(date);
  }

  return date ? format(new Date(date), fm, { locale } ) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date),{ 
        addSuffix: true,
        locale,
      })
    : '';
}