import MyCustomScreen from "./custom_code/MyCustomScreen";

export const applyCustomCode = (externalCodeSetup: any) => {
  externalCodeSetup.navigationApi.addNavigationRoute(
    "customScreen",
    "MyCustomScreen",
    MyCustomScreen,
    "All" // "Auth" | "noAuth" | "Main" | "All"
  );
};