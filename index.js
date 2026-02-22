import React from "react";
import { NativeModules } from "react-native";
import MyCustomScreen from "./custom_code/MyCustomScreen";
import StockSearchScreen from "./custom_code/screens/StockSearchScreen";
import TickerDetailScreen from "./custom_code/screens/TickerDetailScreen";
import stockReducer from "./custom_code/redux/stockReducer";

const { RNCustomCode } = NativeModules;

export const applyCustomCode = (externalCodeSetup) => {
  //
  // ─── REDUX: Register stock reducer ────────────────────────────────
  //
  const REDUCER_NAME = "stocks";

  externalCodeSetup.reduxApi.addReducer(REDUCER_NAME, stockReducer);

  // Persist favorites across sessions
  externalCodeSetup.reduxApi.addPersistorConfigChanger((config) => ({
    ...config,
    whitelist: [...config.whitelist, REDUCER_NAME],
  }));

  //
  // ─── NAVIGATION: Register screens ─────────────────────────────────
  //

  // Stock Search screen (main stocks tab)
  externalCodeSetup.navigationApi.addNavigationRoute(
    "StockSearchScreen",
    "StockSearchScreen",
    StockSearchScreen,
    "Main"
  );

  // Ticker Detail screen (accessible from any stack)
  externalCodeSetup.navigationApi.addNavigationRoute(
    "TickerDetailScreen",
    "TickerDetailScreen",
    TickerDetailScreen,
    "All"
  );

  // Existing custom screen
  externalCodeSetup.navigationApi.addNavigationRoute(
    "customScreen",
    "MyCustomScreen",
    MyCustomScreen,
    "All"
  );

  //
  // ─── GLOBAL STYLES ────────────────────────────────────────────────
  //
  externalCodeSetup.cssApi.addGlobalStyle("stocksContainer", {
    backgroundColor: "#F2F2F7",
  });
};
