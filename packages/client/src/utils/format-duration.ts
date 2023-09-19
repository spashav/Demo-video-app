import * as moment from 'moment/moment';

const hour = 24 * 60 * 1e3
export const formatDuration = (duration: number) => {
  return moment.utc(duration).format(duration > hour ? 'HH:mm:ss' : 'mm:ss');
};
