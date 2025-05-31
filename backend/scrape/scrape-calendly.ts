import { BROWSERLESS_API_URL } from './constants';

const getBodyFunction = (calendlyUrl: string, weeks: number) => {
  return `
const getNextMonday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilNextMonday = (8 - dayOfWeek) % 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday);
  return nextMonday;
};

const getFormattedDate = (date) => {
  let month = date.getMonth().toString();
  if (month.length === 1) {
    month = '0' + month;
  }

  let monthDate = date.getDate().toString();
  if (monthDate.length === 1) {
    monthDate = '0' + monthDate;
  }
  return date.getFullYear() + month + monthDate;
};

const MONTH_INDEX = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export default async function ({ page }) {
  const startDate = getNextMonday();
  const startDateStr = getFormattedDate(startDate);

  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  endDate.setDate(endDate.getDate() + (7 * ${weeks} - 1));
  const endDateStr = getFormattedDate(endDate);

  await page.goto(${JSON.stringify(
    calendlyUrl,
  )}, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 1280, height: 800 });

  const slots = {};

  while (true) {
    await page.waitForSelector('[data-testid="calendar-header"]');

    const headerTitle = await page.$eval(
      '[data-testid="calendar-header"] div[data-testid="title"]',
      (el) => el.textContent,
    );

    const [calendarMonth, year] = headerTitle.split(' ');

    const currMonthIdx = MONTH_INDEX[calendarMonth];

    // only if current month is within range we want to check
    if (
      startDate.getMonth() <= currMonthIdx &&
      currMonthIdx <= endDate.getMonth()
    ) {
      // wait for calendar buttons to become available (3 seconds max)
      try {
        await page.waitForFunction(
          () => {
            const dateButtons = Array.from(
              document.querySelectorAll(
                '[data-testid="calendar-table"] button',
              ),
            );

            return dateButtons.some((btn) => !btn.disabled);
          },
          { timeout: 3000 },
        );
      } catch (err) {
        console.log("No active buttons in", calendarMonth, year);
      }

      const rowHandles = await page.$$('[data-testid="calendar-table"] tr');

      for (const rowHandle of rowHandles) {
        const tdHandles = await rowHandle.$$('td');

        for (const td of tdHandles) {
          const day = await td.evaluate((el) => el.textContent?.trim());

          const btnHandle = await td.$('button');
          if (!btnHandle) continue;

          const ariaLabel = await btnHandle.evaluate((el) =>
            el.getAttribute('aria-label'),
          );
          if (!ariaLabel) continue;

          const [, divMonth] = ariaLabel.split(' - ')[0].split(' ');

          const currentDate = new Date(
            Number(year),
            MONTH_INDEX[calendarMonth],
            Number(day),
          );
          const currentDateStr = getFormattedDate(currentDate);

          const isDisabled = await page.evaluate(
            (button) => button.disabled,
            btnHandle,
          );

          if (divMonth !== calendarMonth) {
            continue;
          }
          if (currentDateStr < startDateStr) {
            continue;
          }

          if (!isDisabled) {
            await btnHandle.click();
            await page.waitForSelector('div[data-component="spot-list"]');

            const timeSlots = await page.$$eval(
              'div[data-component="spot-list"] div[role="listitem"]',
              (els) => els.map((el) => el.textContent?.trim() || ''),
            );

            if (!slots[year]) slots[year] = {};
            if (!slots[year][calendarMonth]) slots[year][calendarMonth] = [];

            slots[year][calendarMonth].push({
              monthDay: day,
              timeSlots,
            });
          } else {
            if (!slots[year]) slots[year] = {};
            if (!slots[year][calendarMonth]) slots[year][calendarMonth] = [];

            slots[year][calendarMonth].push({ monthDay: day });
          }

          if (currentDateStr === endDateStr) {
            return {
              data: slots,
              type: "application/json"
            };
          }
        }
      }
    }

    // Go to next month
    const navButtons = await page.$$('[data-testid="calendar-header"] button');
    if (navButtons.length > 1) {
      await navButtons[1].click();

      try {
        await page.waitForFunction(
          (prevMonth) => {
            const headerElement = document.querySelector(
              '[data-testid="calendar-header"] div[data-testid="title"]',
            );

            if (!headerElement) return false;

            const headerText = headerElement.textContent?.trim();

            if (!headerText) return false;

            const [newMonth, year] = headerText.split(' ');

            if (!newMonth) return false;

            return newMonth !== prevMonth;
          },
          { timeout: 3000 },
          calendarMonth,
        );
      } catch (err) {
        console.log("Navigation error:", err);
        console.log("Page url:", page.url());
      }
    } else {
      console.log('navigation button not found!!');
      break; // fail-safe to avoid infinite loop
    }
  }

  return {
    data: null,
    type: "application/json"
  };
}
  `;
};

const scrapeCalendly = async (calendlyUrl: string, weeks: number) => {
  const headers = {
    'Content-Type': 'application/javascript',
  };

  const response = await fetch(
    `${BROWSERLESS_API_URL}?token=${process.env.BROWSERLESS_API_KEY}`,
    {
      method: 'POST',
      headers: headers,
      body: getBodyFunction(calendlyUrl, weeks),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.log('Error:', errorText);
    return null;
  }

  const availData = await response.json();
  return availData.data;
};

export default scrapeCalendly;
