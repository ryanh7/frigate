import { h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { FormattedMessage } from 'react-intl';


const timeAgo = ({ time, currentTime = new Date(), dense = false }) => {
  if (typeof time !== 'number' || time < 0) return <FormattedMessage id='Invalid Time Provided' defaultMessage='Invalid Time Provided' />;

  const pastTime = new Date(time);
  const elapsedTime = currentTime.getTime() - pastTime.getTime();

  const timeUnits = [
    { unit: 'yr', full: 'year', value: 31536000 },
    { unit: 'mo', full: 'month', value: 0 },
    { unit: 'd', full: 'day', value: 86400 },
    { unit: 'h', full: 'hour', value: 3600 },
    { unit: 'm', full: 'minute', value: 60 },
    { unit: 's', full: 'second', value: 1 },
  ];

  const elapsed = elapsedTime / 1000;
  if (elapsed < 10) {
    return <FormattedMessage id='just now' defaultMessage='just now' />;
  }

  for (let i = 0; i < timeUnits.length; i++) {
    // if months
    if (i === 1) {
      // Get the month and year for the time provided
      const pastMonth = pastTime.getUTCMonth();
      const pastYear = pastTime.getUTCFullYear();

      // get current month and year
      const currentMonth = currentTime.getUTCMonth();
      const currentYear = currentTime.getUTCFullYear();

      let monthDiff = (currentYear - pastYear) * 12 + (currentMonth - pastMonth);

      // check if the time provided is the previous month but not exceeded 1 month ago.
      if (currentTime.getUTCDate() < pastTime.getUTCDate()) {
        monthDiff--;
      }

      if (monthDiff > 0) {
        const unitAmount = monthDiff;
        return <>
          <FormattedMessage id={`${timeUnits[i].full}_ago`} defaultMessage={`{unitAmount}${dense ? timeUnits[i].unit : ` ${timeUnits[i].full}`}${dense ? '' : 's'} ago`} values={{unitAmount}}/>
        </>;
      }
    } else if (elapsed >= timeUnits[i].value) {
      const unitAmount = Math.floor(elapsed / timeUnits[i].value);
      return <>
        <FormattedMessage id={`${timeUnits[i].full}_ago`} defaultMessage={`{unitAmount}${dense ? timeUnits[i].unit : ` ${timeUnits[i].full}`}${dense ? '' : 's'} ago`} values={{unitAmount}}/>
      </>;
    }
  }
  return <FormattedMessage id='Invalid Time' defaultMessage='Invalid Time' />;
};

const TimeAgo = ({ refreshInterval = 1000, ...rest }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, refreshInterval);
    return () => clearInterval(intervalId);
  }, [refreshInterval, setCurrentTime]);

  const timeAgoValue = useMemo(() => timeAgo({ currentTime, ...rest }), [currentTime, rest]);

  return <span>{timeAgoValue}</span>;
};
export default TimeAgo;
