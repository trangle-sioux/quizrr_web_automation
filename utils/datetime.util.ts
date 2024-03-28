import dayjs from 'dayjs';

export function getUnixEpochTime(date?: string) {
  if (typeof date === 'undefined') {
    return Date.parse(new Date().toString());
  }

  return Date.parse(date);
}

export function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString([], {
    month: 'long',
  });
}

export function converStringDateToStringDate(date: string) {
  let formatted = '';
  if (date.trim().length === 0) {
    formatted = formatted;
  } else {
    const dt = dayjs(date);
    formatted = dt.format('YYYY-MM-DD HH:mm');
  }
  return formatted;
}
