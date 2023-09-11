import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./Main";
import { AuthProvider } from "./utils/useAuth";
import { LogBox } from "react-native";
import { BLEProvider } from "./utils/useBLE";

export default function App() {
  LogBox.ignoreLogs(["new NativeEventEmitter"]);
  return (
    <AuthProvider>
      <BLEProvider>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </BLEProvider>
    </AuthProvider>
  );
}
