export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
