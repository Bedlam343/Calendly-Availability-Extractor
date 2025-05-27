const MODE = import.meta.env.MODE;
import { API_BASE_URL, NETLIFY_SERVERLESS_BASE_URL } from 'src/utils/constant';

export const scrapeCalendly = async (calendlyUrl: string, weeks: number) => {
  try {
    const url =
      MODE === 'production'
        ? `${NETLIFY_SERVERLESS_BASE_URL}/scrapeCalendly`
        : API_BASE_URL;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ calendlyUrl, weeks }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching availability`);
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
