export const getStatusBadgeColor = (status) => {
  switch (status) {
    case "GA": return "green";
    case "EOL": return "red";
    case "DEV": return "yellow";
    default: return "gray";
  }
};
