export const formatDate = (
  dateString: string,
  options?: { includeDay?: boolean },
): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();

  if (options?.includeDay) {
    const day = date.getDate();
    return `${month.toUpperCase()} ${day}, ${year}`;
  }

  return `${month.toUpperCase()} ${year}`;
};
