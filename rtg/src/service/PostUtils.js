import {
  differenceInMinutes,
  differenceInSeconds,
  format,
  formatDistanceStrict,
  isSameDay,
  subDays,
} from 'date-fns';
import de from 'date-fns/locale/de';

const getFormattedPostDate = (date) => {
  const now = new Date();

  if (differenceInSeconds(now, date) < 60) {
    return 'Gerade eben';
  }
  if (differenceInMinutes(now, date) < 60) {
    return formatDistanceStrict(date, now, { locale: de, addSuffix: true, unit: 'minute' });
  }

  const formattedTime = format(date, 'HH:mm \'Uhr\'');
  if (isSameDay(date, new Date())) { return `Heute, ${formattedTime}`; }
  if (isSameDay(date, subDays(new Date(), 1))) { return `Gestern, ${formattedTime}`; }

  return `${format(date, 'EEEEEE. d. MMM yyyy', { locale: de })}, ${formattedTime}`;
};

export default getFormattedPostDate;
