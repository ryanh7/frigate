import { FormattedMessage } from 'react-intl';

export function FormattedDuration ({ start_time, end_time }) {
  if (isNaN(start_time)) {
    return  <FormattedMessage id='Invalid start time' defaultMessage='Invalid start time' />;
  }

  if (end_time === null) {
    return  <FormattedMessage id='In progress' defaultMessage='In Progress' />;
  }

  if (isNaN(end_time)) {
    return  <FormattedMessage id='Invalid end time' defaultMessage='Invalid end time' />;
  }

  const duration = Math.floor(end_time - start_time);
  const seconds = duration % 60;
  const minutes = Math.floor(duration / 60) % 60;
  const hours = Math.floor(duration / 3600);

  return  (
    <>
      {hours > 0 && <FormattedMessage id='duration_hours' defaultMessage='{hours}h' values={{hours}} />}
      {minutes > 0 && <FormattedMessage id='duration_minutes' defaultMessage='{minutes}m' values={{minutes}} />}
      {seconds > 0 && <FormattedMessage id='duration_seconds' defaultMessage='{seconds}s' values={{seconds}} />}
    </>
  );
};

