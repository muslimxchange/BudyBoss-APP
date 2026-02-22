// Action Types
export const STOCK_SEARCH_REQUEST = "stocks/SEARCH_REQUEST";
export const STOCK_SEARCH_SUCCESS = "stocks/SEARCH_SUCCESS";
export const STOCK_SEARCH_FAILURE = "stocks/SEARCH_FAILURE";
export const STOCK_SEARCH_CLEAR = "stocks/SEARCH_CLEAR";

export const STOCK_DETAIL_REQUEST = "stocks/DETAIL_REQUEST";
export const STOCK_DETAIL_SUCCESS = "stocks/DETAIL_SUCCESS";
export const STOCK_DETAIL_FAILURE = "stocks/DETAIL_FAILURE";

export const STOCK_SET_FAVORITES = "stocks/SET_FAVORITES";
export const STOCK_TOGGLE_FAVORITE = "stocks/TOGGLE_FAVORITE";

// Action Creators
export const searchStocks = (query) => ({
  type: STOCK_SEARCH_REQUEST,
  payload: { query },
});

export const searchStocksSuccess = (results) => ({
  type: STOCK_SEARCH_SUCCESS,
  payload: { results },
});

export const searchStocksFailure = (error) => ({
  type: STOCK_SEARCH_FAILURE,
  payload: { error },
});

export const clearSearch = () => ({
  type: STOCK_SEARCH_CLEAR,
});

export const loadStockDetail = (symbol) => ({
  type: STOCK_DETAIL_REQUEST,
  payload: { symbol },
});

export const loadStockDetailSuccess = (symbol, data) => ({
  type: STOCK_DETAIL_SUCCESS,
  payload: { symbol, data },
});

export const loadStockDetailFailure = (symbol, error) => ({
  type: STOCK_DETAIL_FAILURE,
  payload: { symbol, error },
});

export const toggleFavorite = (symbol) => ({
  type: STOCK_TOGGLE_FAVORITE,
  payload: { symbol },
});
