import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import { useAuth } from "./utils/useAuth";
import { ExpoPushTokenProvider } from "./utils/usePushToken";
import { HelmetsProvider } from "./utils/useHelmets";
import AddChild from "./screens/AddChild";

const Tab = createNativeStackNavigator();

export default function Main() {
  const { isUser, user, isLoading } = useAuth();

  useEffect(() => {
    isUser();
  }, []);

  if (isLoading) return <Text>Loading</Text>;

  return (
    <HelmetsProvider user={user}>
      <ExpoPushTokenProvider user={user}>
        <Tab.Navigator>
          {!!user ? (
            <>
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="AddChild" component={AddChild} />
            </>
          ) : (
            <>
              <Tab.Screen name="Login" component={Login} />
              <Tab.Screen name="Signup" component={Signup} />
            </>
          )}
        </Tab.Navigator>
      </ExpoPushTokenProvider>
    </HelmetsProvider>
  );
}
