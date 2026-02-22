// API Configuration
export const FMP_API_KEY = "23ef84521f6cbb20f342313b20256dad";
export const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

export const WP_BASE_URL = "https://muslimxchange.com";
export const WP_API_URL = `${WP_BASE_URL}/wp-json/wp/v2`;

// FMP API Endpoints
export const FMP_ENDPOINTS = {
  quote: (symbol) => `${FMP_BASE_URL}/quote/${symbol}?apikey=${FMP_API_KEY}`,
  profile: (symbol) => `${FMP_BASE_URL}/profile/${symbol}?apikey=${FMP_API_KEY}`,
  historicalPrice: (symbol, from, to) =>
    `${FMP_BASE_URL}/historical-price-full/${symbol}?from=${from}&to=${to}&apikey=${FMP_API_KEY}`,
  historicalPriceDaily: (symbol) =>
    `${FMP_BASE_URL}/historical-price-full/${symbol}?timeseries=365&apikey=${FMP_API_KEY}`,
  incomeStatement: (symbol, limit = 4) =>
    `${FMP_BASE_URL}/income-statement/${symbol}?limit=${limit}&apikey=${FMP_API_KEY}`,
  keyMetrics: (symbol, limit = 1) =>
    `${FMP_BASE_URL}/key-metrics/${symbol}?limit=${limit}&apikey=${FMP_API_KEY}`,
  search: (query) =>
    `${FMP_BASE_URL}/search?query=${encodeURIComponent(query)}&limit=20&apikey=${FMP_API_KEY}`,
  intradayPrice: (symbol) =>
    `${FMP_BASE_URL}/historical-chart/5min/${symbol}?apikey=${FMP_API_KEY}`,
};

// WordPress Endpoints
export const WP_ENDPOINTS = {
  tickers: (params = "") => `${WP_API_URL}/ticker?${params}`,
  ticker: (id) => `${WP_API_URL}/ticker/${id}`,
  tickerBySlug: (slug) => `${WP_API_URL}/ticker?slug=${slug}`,
  searchTickers: (query) =>
    `${WP_API_URL}/ticker?search=${encodeURIComponent(query)}&per_page=20`,
};
