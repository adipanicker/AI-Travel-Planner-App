import "dotenv/config";

export default {
  expo: {
    name: "ai-travel-planner-app",
    slug: "ai-travel-planner-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", ["@react-native-google-signin/google-signin"]],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
      GOOGLE_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY,
    },
  },
};
