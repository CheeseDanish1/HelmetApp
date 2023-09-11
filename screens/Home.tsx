import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBLE } from "../utils/useBLE";
import CrashDetectionComponent from "../components/CrashDetectionComponent";
import Logout from "../components/Logout";
import { useHelmets } from "../utils/useHelmets";
import ConnectToExistingDevice from "../components/ConnectToExistingDevice";

export default function Home({ navigation }: { navigation: any }) {
  const [error, setError] = useState("");
  const { crash, setCrash, connectedDevice } = useBLE();

  const { allHelmets } = useHelmets();

  return (
    <SafeAreaView style={styles.container}>
      <Logout />

      <View style={styles.heartRateTitleWrapper}>
        <ConnectToExistingDevice deviceIds={allHelmets.map((h) => h.id)} />
      </View>
      <Text>{error}</Text>

      <Text>{connectedDevice ? `Connected to ${connectedDevice.id}` : ""}</Text>
      <TouchableOpacity
        onPress={() => {
          if (!connectedDevice) navigation.navigate("AddChild");
          else
            setError(
              "You must disconnect from your current device to add another one"
            );
        }}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>Add new child</Text>
      </TouchableOpacity>

      {/* CRASH MODULE */}
      <CrashDetectionComponent setShowModal={setCrash} showModal={crash} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 10,
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  crashCountdownWrapper: {
    alignItems: "center",
    marginTop: 10,
  },
  crashCountdownText: {
    fontSize: 18,
    color: "red",
    marginBottom: 5,
  },
  cancelCrashButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 8,
  },
  cancelCrashButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
