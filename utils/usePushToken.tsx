import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { saveNotificationToken } from "../utils/api";

interface ExpoPushTokenContextType {
  expoPushToken: string;
}

const ExpoPushTokenContext = createContext<
  ExpoPushTokenContextType | undefined
>(undefined);

export function useExpoPushToken() {
  const context = useContext(ExpoPushTokenContext);
  if (!context) {
    throw new Error(
      "useExpoPushToken must be used within an ExpoPushTokenProvider"
    );
  }
  return context;
}

interface ExpoPushTokenProviderProps {
  children: React.ReactNode;
  user: any;
}

export function ExpoPushTokenProvider({
  user,
  children,
}: ExpoPushTokenProviderProps) {
  const [expoPushToken, setExpoPushToken] = useState<string>("");

  async function registerForPushNotificationsAsync() {
    return "9083092";

    let token = "";
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      let projectId = Constants.expoConfig?.extra?.eas.projectId;
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        })
      ).data;
    } else {
      alert("Must use a physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    if (user && !expoPushToken) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          setExpoPushToken(token);
          saveNotificationToken({ token });
        }
      });
    }
  }, [user]);

  const contextValue: ExpoPushTokenContextType = {
    expoPushToken,
  };

  return (
    <ExpoPushTokenContext.Provider value={contextValue}>
      {children}
    </ExpoPushTokenContext.Provider>
  );
}
