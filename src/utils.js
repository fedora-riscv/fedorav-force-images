export function formatDate (timestamp) {
  if (!timestamp) return 'Unknown';

  let date;

  if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  }
  else if (typeof timestamp === 'number') {
    date = timestamp.toString().length > 10
      ? new Date(timestamp)
      : new Date(timestamp * 1000);
  }
  else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) {
    return timestamp.toString();
  }

  return date.toLocaleDateString();
};
