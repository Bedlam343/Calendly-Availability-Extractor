export type Availability = {
  [key: string]: {
    [key: string]: { monthDay: string; timeSlots: string[] }[];
  };
};
