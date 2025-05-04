export const getFullDate = (date: string): string => {
  const dateAndTime = date.split('T');

  return dateAndTime[0].split('-').join('-');
};
