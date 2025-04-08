// Exchange Rate Service for interacting with exchangerate.host API

// API key from exchangerate.host
const API_KEY = "cde3827b5fac41cb2f03baab5745539b";
const BASE_URL = "https://api.exchangerate.host";

/**
 * Fetches the latest exchange rates for a base currency
 * @param baseCurrency The base currency code (e.g., 'USD')
 * @returns Promise with the latest exchange rates
 */
export const getLatestRates = async (baseCurrency: string = "USD") => {
  try {
    const response = await fetch(
      `${BASE_URL}/live?access_key=${API_KEY}&source=${baseCurrency}`,
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.info || "Unknown API error");
    }

    return data;
  } catch (error) {
    console.error("Error fetching latest rates:", error);
    throw error;
  }
};

/**
 * Converts an amount from one currency to another
 * @param fromCurrency The source currency code
 * @param toCurrency The target currency code
 * @param amount The amount to convert
 * @returns Promise with the conversion result
 */
export const convertCurrency = async (
  fromCurrency: string,
  toCurrency: string,
  amount: number,
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/convert?access_key=${API_KEY}&from=${fromCurrency}&to=${toCurrency}&amount=${amount}`,
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.info || "Unknown API error");
    }

    return data;
  } catch (error) {
    console.error("Error converting currency:", error);
    throw error;
  }
};

/**
 * Fetches historical exchange rates for a time period
 * @param baseCurrency The base currency code
 * @param targetCurrency The target currency code
 * @param startDate The start date in YYYY-MM-DD format
 * @param endDate The end date in YYYY-MM-DD format
 * @returns Promise with the historical data
 */
export const getHistoricalRates = async (
  baseCurrency: string,
  targetCurrency: string,
  startDate: string,
  endDate: string,
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/timeframe?access_key=${API_KEY}&source=${baseCurrency}&currencies=${targetCurrency}&start_date=${startDate}&end_date=${endDate}`,
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.info || "Unknown API error");
    }

    return data;
  } catch (error) {
    console.error("Error fetching historical rates:", error);
    throw error;
  }
};
