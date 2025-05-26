import { useState } from 'react';
import TimeSlots from 'src/components/TimeSlots';
import { getDayOfWeek, splitArray } from 'src/utils/helpers';
import { MONTH_INDEX } from 'src/utils/constant';
import type { Availability as AvailabilityType } from 'src/utils/types';

type Props = {
  availData?: AvailabilityType;
};

const Availability = ({ availData }: Props) => {
  const [activeDay, setActiveDay] = useState({
    year: '',
    month: '',
    monthDay: '',
    timeSlots: [] as string[],
  });

  if (!availData) return null;

  function handleDayClick(
    year: string,
    month: string,
    monthDay: string,
    timeSlots: string[],
  ) {
    setActiveDay({ year, month, monthDay, timeSlots });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-8">
        <p className="text-2xl text-center">Availability (Next 4 Weeks)</p>
        <div className="flex flex-col gap-6">
          {Object.keys(availData).map((year) => {
            const months = availData[year];

            return Object.keys(months).map((month) => {
              const days = months[month];
              const { dayNumber: dayOfWeek } = getDayOfWeek(
                Number(year),
                MONTH_INDEX[month as keyof typeof MONTH_INDEX],
                Number(days[0].monthDay),
              );

              const emptyDays = Array.from({ length: dayOfWeek }, () => ({
                monthDay: undefined,
              }));

              const allDays = [...emptyDays, ...days];
              const weeks = splitArray(allDays, 7);

              function isActive(year: string, month: string, monthDay: string) {
                if (
                  year === activeDay?.year &&
                  month === activeDay?.month &&
                  monthDay === activeDay?.monthDay
                )
                  return true;
                return false;
              }

              return (
                <div
                  key={`${year}-${month}`}
                  className="flex flex-col items-center "
                >
                  <div>
                    <p className="text-xl mb-2">
                      {month} {year}
                    </p>

                    <div className="border-[1px] border-black rounded-lg px-2 py-2">
                      <table className="">
                        <thead className="">
                          <tr>
                            {[
                              'Mon',
                              'Tue',
                              'Wed',
                              'Thu',
                              'Fri',
                              'Sat',
                              'Sun',
                            ].map((day) => (
                              <td
                                key={day}
                                className="px-2 py-1 text-center w-[40px] font-semibold"
                              >
                                {day}
                              </td>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {weeks.map((week) => (
                            <tr
                              key={`${year}-${month}-${JSON.stringify(week)}`}
                            >
                              {week.map((day) => (
                                <td
                                  className={`px-1 py-1 w-[45px] rounded-full ${
                                    isActive(year, month, day.monthDay!)
                                      ? 'bg-blue-300'
                                      : ''
                                  } ${
                                    !day.timeSlots ? '' : 'hover:bg-blue-300'
                                  }`}
                                  key={`${year}-${month}-${
                                    day.monthDay ?? Math.random()
                                  }`}
                                >
                                  <button
                                    onClick={() =>
                                      handleDayClick(
                                        year,
                                        month,
                                        day.monthDay!,
                                        day.timeSlots,
                                      )
                                    }
                                    className={`w-full text-center ${
                                      !day.timeSlots ? 'text-gray-400' : ''
                                    }`}
                                    disabled={!day.timeSlots}
                                  >
                                    {day.monthDay}
                                  </button>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>

      {activeDay && (
        <div className="mt-[50px]">
          <TimeSlots {...activeDay} />
        </div>
      )}
    </div>
  );
};

export default Availability;
