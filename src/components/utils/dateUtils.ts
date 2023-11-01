import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

export function getLastUpdatedLabel({ last_updated }: { last_updated: string | undefined }): string {
  if (!last_updated) {
    return '';
  }
  return dayjs(last_updated).format('ll');
}

export const getCurrentYear = (): string => dayjs().format('YYYY');

export const getXYearsAgoYear = (years: number): string => dayjs().subtract(years, 'year').format('YYYY');

export function getYearPercentage(): number {
  const start = dayjs().startOf('year');
  const today = dayjs();
  const todayDiff = today.diff(start, 'day');
  return Math.round((todayDiff / 365) * 100);
}