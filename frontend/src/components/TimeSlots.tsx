import { getDayOfWeek } from 'src/utils/helpers';
import { MONTH_INDEX } from 'src/utils/constant';

type Props = {
  year: string;
  month: string;
  monthDay: string;
  timeSlots: string[];
};

const TimeSlots = ({ year, month, monthDay, timeSlots }: Props) => {
  const { day: dayOfWeek } = getDayOfWeek(
    Number(year),
    MONTH_INDEX[month as keyof typeof MONTH_INDEX],
    Number(monthDay),
  );

  return (
    <div className="flex justify-center">
      <div className="w-[500px]">
        <p className="text-lg font-semibold mb-3">
          {dayOfWeek}, {month} {monthDay}
        </p>
        <div className="flex flex-wrap gap-4">
          {timeSlots.map((slot) => (
            <div
              key={slot}
              className="flex items-center justify-center w-[100px] h-[40px] border-[1px] border-gray-300 rounded-md px-3 py-1 hover:cursor-pointer hover:border-gray-500"
            >
              <p>{slot}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;
