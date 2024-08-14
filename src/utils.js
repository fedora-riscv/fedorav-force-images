export function formatDate (timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};
