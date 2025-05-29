// index.js
 
 
import React from "react";
import {NativeModules} from "react-native";
import MyCustomScreen from "./custom_code/MyCustomScreen";
const {RNCustomCode} = NativeModules;
 
export const applyCustomCode = externalCodeSetup => {
  externalCodeSetup.navigationApi.addNavigationRoute(
"customScreen",
"MyCustomScreen",
MyCustomScreen,
"All" // "Auth" | "noAuth" | "Main" | "All"
  );
};