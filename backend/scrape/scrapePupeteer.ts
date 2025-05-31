import puppeteer from 'puppeteer';
import { getNextMonday, getFormattedDate } from './helpers';
import { MONTH_INDEX } from './constants';
import type { Availability } from './types';

const scrapeCalendly = async (calendlyUrl: string, weeks: number) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const startDate = getNextMonday();
  const startDateStr = getFormattedDate(startDate);

  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  endDate.setDate(endDate.getDate() + (7 * weeks - 1));
  const endDateStr = getFormattedDate(endDate);

  try {
    await page.goto(calendlyUrl, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 1280, height: 800 });

    const slots: Availability = {};

    while (true) {
      await page.waitForSelector('[data-testid="calendar-header"]');

      const headerTitle = await page.$eval(
        '[data-testid="calendar-header"] div[data-testid="title"]',
        (el) => el.textContent,
      );

      const [calendarMonth, year] = headerTitle!.split(' ');

      const currMonthIdx =
        MONTH_INDEX[calendarMonth as keyof typeof MONTH_INDEX];

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

              return dateButtons.some(
                (btn) => !(btn as HTMLButtonElement).disabled,
              );
            },
            { timeout: 3000 },
          );
        } catch (err) {
          console.log(`No active buttons in ${calendarMonth} ${year}`);
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
              MONTH_INDEX[calendarMonth as keyof typeof MONTH_INDEX],
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
                monthDay: day!,
                timeSlots,
              });
            } else {
              if (!slots[year]) slots[year] = {};
              if (!slots[year][calendarMonth]) slots[year][calendarMonth] = [];

              slots[year][calendarMonth].push({ monthDay: day! });
            }

            if (currentDateStr === endDateStr) {
              await browser.close();
              return slots;
            }
          }
        }
      }

      // Go to next month
      const navButtons = await page.$$(
        '[data-testid="calendar-header"] button',
      );
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

              const [newMonth, year] = headerText!.split(' ');

              if (!newMonth) return false;

              return newMonth !== prevMonth;
            },
            { timeout: 3000 },
            calendarMonth,
          );
        } catch (err) {
          console.log(`Navigation error: ${err}`);
          console.log(`Page url: ${page.url()}`);
        }
      } else {
        console.log('navigation button not found!!');
        break; // fail-safe to avoid infinite loop
      }
    }
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    await browser.close();
  }
};
