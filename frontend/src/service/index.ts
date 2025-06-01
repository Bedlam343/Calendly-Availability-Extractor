const MODE = import.meta.env.MODE;
const LAMBDA_FUNCTION_URL = import.meta.env.VITE_AWS_LAMBDA_FUNCTION_URL;
const LAMBDA_AUTH_KEY = import.meta.env.VITE_AWS_LAMBDA_AUTH_KEY;
const LOCAL_API_BASE_URL = import.meta.env.VITE_LOCAL_API_BASE_URL;

export const scrapeCalendly = async (calendlyUrl: string, weeks: number) => {
  try {
    const url =
      MODE === 'production' ? LAMBDA_FUNCTION_URL : LOCAL_API_BASE_URL;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': LAMBDA_AUTH_KEY,
      },
      body: JSON.stringify({ calendlyUrl, weeks }),
    });

    if (!response.ok) {
      console.error(await response.text());
      throw new Error(`Error fetching availability`);
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
