export function splitArray<T>(inputArray: T[], chunkSize = 7) {
  const result = inputArray.reduce((resultArray: T[][], item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] as T[];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
}

export const getDayOfWeek = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  const dayNumber = date.getDay(); // Returns 0 (Sunday) to 6 (Saturday)

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return {
    day: days[dayNumber],
    dayNumber: (dayNumber + 6) % 7, // Now 0 (Monday) to 6 (Sunday)
  };
};
