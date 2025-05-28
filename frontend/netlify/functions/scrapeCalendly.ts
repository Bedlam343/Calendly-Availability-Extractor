import { Context } from '@netlify/functions';
import { chromium } from 'playwright-core';
import { getFormattedDate, getNextMonday } from './utils/helpers';
import { MONTH_INDEX } from './utils/constants';
import { Availability } from './utils/types';

const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY as string;

export default async (request: Request, context: Context) => {
  const body = await request.json();
  const { calendlyUrl, weeks } = body;

  const browser = await chromium.connect(
    `wss://production-sfo.browserless.io/chromium/playwright?token=${BROWSERLESS_API_KEY}`,
  );
  const page = await browser.newPage();

  const startDate = getNextMonday();
  const startDateStr = getFormattedDate(startDate);

  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDay(),
  );
  endDate.setDate(endDate.getDate() + 7 * weeks);
  const endDateStr = getFormattedDate(endDate);

  try {
    await page.goto(calendlyUrl, { waitUntil: 'networkidle' });

    const slots: Availability = {};

    while (true) {
      await page.waitForSelector('[data-testid="calendar-header"]');

      const tableHeader = page.getByTestId('calendar-header');

      const headerTitle = await tableHeader
        .locator('div[data-testid="title"]')
        .textContent();

      const [calendarMonth, year] = headerTitle!.split(' ');

      const tbody = page.getByTestId('calendar-table');
      const rows = tbody.locator('tr');
      const rowCount = await rows.count();

      for (let i = 0; i < rowCount; ++i) {
        const row = rows.nth(i);
        const tds = row.locator('td');
        const tdCount = await tds.count();

        for (let j = 0; j < tdCount; ++j) {
          const td = tds.nth(j);
          const day = await td.textContent();

          const btn = td.locator('button');
          const ariaLabel = await btn.getAttribute('aria-label');
          const [, divMonth] = ariaLabel!.split(' - ')[0].split(' ');

          const currentDate = new Date(
            Number(year),
            MONTH_INDEX[calendarMonth as keyof typeof MONTH_INDEX],
            Number(day),
          );
          const currentDateStr = getFormattedDate(currentDate);

          const isDisabled = await btn.isDisabled();

          if (divMonth !== calendarMonth) {
            continue;
          }

          if (currentDateStr < startDateStr) {
            continue;
          }

          if (!isDisabled) {
            await btn.click();
            const spotList = page.locator('div[data-component="spot-list"]');
            const spotDivs = spotList.locator('div[role="listitem"]');
            const numSpots = await spotDivs.count();

            const timeSlots = [];

            for (let k = 0; k < numSpots; ++k) {
              const spot = spotDivs.nth(k);
              const time = await spot.textContent();
              timeSlots.push(time);
            }

            if (!slots[year]) {
              slots[year] = {};
              slots[year][calendarMonth] = [];
            } else if (!slots[year][calendarMonth]) {
              slots[year][calendarMonth] = [];
            }

            slots[year][calendarMonth].push({
              monthDay: day!,
              timeSlots: timeSlots as string[],
            });
          } else {
            slots[year][calendarMonth].push({ monthDay: day! });
          }

          if (currentDateStr === endDateStr) {
            await browser.close();
            return new Response(JSON.stringify(slots));
          }
        }
      }

      // go to next month
      const nextBtn = tableHeader.locator('button').nth(1);
      await nextBtn.click();

      const newUrl = page.url();
      // Now force navigation to that updated URL
      await page.goto(newUrl, { waitUntil: 'networkidle' });
    }
  } catch (err) {
    console.error(err);
    return new Response(null);
  } finally {
    await browser.close();
  }
};
