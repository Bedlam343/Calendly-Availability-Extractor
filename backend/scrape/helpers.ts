export const getNextMonday = () => {
  const today = new Date();

  // Find next Monday
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  const daysUntilNextMonday = (8 - dayOfWeek) % 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday);
  return nextMonday;
};

export const getFormattedDate = (date: Date) => {
  let month = date.getMonth().toString();
  if (month.length === 1) {
    month = '0' + month;
  }

  let monthDate = date.getDate().toString();
  if (monthDate.length === 1) {
    monthDate = '0' + monthDate;
  }
  return `${date.getFullYear()}-${month}-${monthDate}`;
};
