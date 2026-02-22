import { FMP_ENDPOINTS } from "../config/api";

const fetchJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FMP API error: ${response.status}`);
  }
  return response.json();
};

// Get real-time quote for a symbol
export const getQuote = async (symbol) => {
  const data = await fetchJSON(FMP_ENDPOINTS.quote(symbol));
  return data?.[0] || null;
};

// Get company profile
export const getProfile = async (symbol) => {
  const data = await fetchJSON(FMP_ENDPOINTS.profile(symbol));
  return data?.[0] || null;
};

// Get historical daily prices (last 365 days)
export const getHistoricalPrices = async (symbol) => {
  const data = await fetchJSON(FMP_ENDPOINTS.historicalPriceDaily(symbol));
  return data?.historical || [];
};

// Get historical prices for a date range
export const getHistoricalPriceRange = async (symbol, from, to) => {
  const data = await fetchJSON(FMP_ENDPOINTS.historicalPrice(symbol, from, to));
  return data?.historical || [];
};

// Get intraday 5-min prices (for 1D chart)
export const getIntradayPrices = async (symbol) => {
  const data = await fetchJSON(FMP_ENDPOINTS.intradayPrice(symbol));
  return data || [];
};

// Get income statement
export const getIncomeStatement = async (symbol, limit = 4) => {
  return fetchJSON(FMP_ENDPOINTS.incomeStatement(symbol, limit));
};

// Get key financial metrics
export const getKeyMetrics = async (symbol, limit = 1) => {
  const data = await fetchJSON(FMP_ENDPOINTS.keyMetrics(symbol, limit));
  return data?.[0] || null;
};

// Search for tickers/companies
export const searchTickers = async (query) => {
  if (!query || query.length < 1) return [];
  return fetchJSON(FMP_ENDPOINTS.search(query));
};

// Get full ticker data (quote + profile + metrics combined)
export const getFullTickerData = async (symbol) => {
  const [quote, profile, keyMetrics] = await Promise.all([
    getQuote(symbol),
    getProfile(symbol),
    getKeyMetrics(symbol),
  ]);
  return { quote, profile, keyMetrics };
};
