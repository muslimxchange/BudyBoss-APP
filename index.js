import React from "react";
import {NativeModules} from "react-native";
import MyCustomScreen from "./MyCustomScreen";
const {RNCustomCode} = NativeModules;
 
export const applyCustomCode = externalCodeSetup => {
  externalCodeSetup.navigationApi.addNavigationRoute(
"customScreen",
"MyCustomScreen",
MyCustomScreen,
"All" // "Auth" | "noAuth" | "Main" | "All"
  );
};