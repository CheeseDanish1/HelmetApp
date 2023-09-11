import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../utils/useAuth";
import { useExpoPushToken } from "../utils/usePushToken";
import { useBLE } from "../utils/useBLE";

export default function Logout() {
  // TODO: Disconnect from any devices

  const { signout } = useAuth();
  const { disconnectFromDevice } = useBLE();
  const { expoPushToken } = useExpoPushToken();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          disconnectFromDevice();
          signout({ expoPushToken });
        }}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
