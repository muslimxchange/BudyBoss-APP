import {
  STOCK_SEARCH_REQUEST,
  STOCK_SEARCH_SUCCESS,
  STOCK_SEARCH_FAILURE,
  STOCK_SEARCH_CLEAR,
  STOCK_DETAIL_REQUEST,
  STOCK_DETAIL_SUCCESS,
  STOCK_DETAIL_FAILURE,
  STOCK_TOGGLE_FAVORITE,
} from "./stockActions";

const initialState = {
  // Search state
  searchQuery: "",
  searchResults: [],
  searchLoading: false,
  searchError: null,

  // Detail cache: { [symbol]: { quote, profile, keyMetrics, shariahData, ... } }
  details: {},
  detailLoading: {},
  detailErrors: {},

  // User favorites
  favorites: [],
};

const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOCK_SEARCH_REQUEST:
      return {
        ...state,
        searchQuery: action.payload.query,
        searchLoading: true,
        searchError: null,
      };

    case STOCK_SEARCH_SUCCESS:
      return {
        ...state,
        searchResults: action.payload.results,
        searchLoading: false,
        searchError: null,
      };

    case STOCK_SEARCH_FAILURE:
      return {
        ...state,
        searchLoading: false,
        searchError: action.payload.error,
      };

    case STOCK_SEARCH_CLEAR:
      return {
        ...state,
        searchQuery: "",
        searchResults: [],
        searchLoading: false,
        searchError: null,
      };

    case STOCK_DETAIL_REQUEST:
      return {
        ...state,
        detailLoading: { ...state.detailLoading, [action.payload.symbol]: true },
        detailErrors: { ...state.detailErrors, [action.payload.symbol]: null },
      };

    case STOCK_DETAIL_SUCCESS:
      return {
        ...state,
        details: {
          ...state.details,
          [action.payload.symbol]: action.payload.data,
        },
        detailLoading: { ...state.detailLoading, [action.payload.symbol]: false },
      };

    case STOCK_DETAIL_FAILURE:
      return {
        ...state,
        detailLoading: { ...state.detailLoading, [action.payload.symbol]: false },
        detailErrors: {
          ...state.detailErrors,
          [action.payload.symbol]: action.payload.error,
        },
      };

    case STOCK_TOGGLE_FAVORITE: {
      const { symbol } = action.payload;
      const isFav = state.favorites.includes(symbol);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter((s) => s !== symbol)
          : [...state.favorites, symbol],
      };
    }

    default:
      return state;
  }
};

export default stockReducer;
