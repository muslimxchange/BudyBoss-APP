import { WP_ENDPOINTS } from "../config/api";

const fetchJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }
  return response.json();
};

// Search tickers in WordPress
export const searchWPTickers = async (query) => {
  if (!query || query.length < 1) return [];
  return fetchJSON(WP_ENDPOINTS.searchTickers(query));
};

// Get a single ticker post by ID
export const getTickerById = async (id) => {
  return fetchJSON(WP_ENDPOINTS.ticker(id));
};

// Get a ticker post by slug (ticker symbol)
export const getTickerBySlug = async (slug) => {
  const data = await fetchJSON(WP_ENDPOINTS.tickerBySlug(slug.toLowerCase()));
  return data?.[0] || null;
};

// Extract Shariah compliance data from a WordPress ticker post
export const extractShariahData = (tickerPost) => {
  if (!tickerPost) return null;

  const meta = tickerPost.acf || tickerPost.meta || {};

  return {
    // Compliance statuses by standard
    standards: {
      aaoifi: {
        label: "AAOIFI",
        status: meta.aaoifi_status || meta.aaoifi_compliance || "unknown",
      },
      sp: {
        label: "S&P Shariah",
        status: meta.sp_shariah_status || meta.sp_compliance || "unknown",
      },
      ftse: {
        label: "FTSE Shariah",
        status: meta.ftse_shariah_status || meta.ftse_compliance || "unknown",
      },
      msci: {
        label: "MSCI",
        status: meta.msci_status || meta.msci_compliance || "unknown",
      },
      dowjones: {
        label: "Dow Jones Islamic",
        status:
          meta.dowjones_islamic_status || meta.dowjones_compliance || "unknown",
      },
    },

    // Financial screening values
    purificationPerShare: meta.purification_per_share || meta.purification || null,
    zakatPerShare: meta.zakat_per_share || meta.zakat || null,
    impureIncomePercent:
      meta.impure_income_percent || meta.impure_income_pct || null,
    debtLevel: meta.debt_level || meta.debt_ratio || null,

    // Additional metadata
    lastUpdated: meta.shariah_last_updated || meta.last_updated || null,
    notes: meta.shariah_notes || meta.compliance_notes || null,
  };
};

// Get Shariah data for a ticker symbol
export const getShariahDataBySymbol = async (symbol) => {
  const tickerPost = await getTickerBySlug(symbol);
  if (!tickerPost) return null;
  return extractShariahData(tickerPost);
};
