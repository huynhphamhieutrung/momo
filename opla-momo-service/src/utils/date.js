const moment = require('moment');
const weekdays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

module.exports = {
  weekdays,
  validateTimezone: (timeZone) => {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
      return false;
    }

    try {
      Intl.DateTimeFormat(undefined, {timeZone});
      return true;
    } catch (e) {
      return false;
    }
  },
  validateTime: (time) => {
    return !time || moment(time, [moment.ISO_8601, 'HH:mm:ss']).isValid();
  },
  validateWeekday: (weekday) => weekdays.includes(weekday),
};
