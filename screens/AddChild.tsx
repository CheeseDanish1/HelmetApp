import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useBLE } from "../utils/useBLE";
import DeviceModal from "../components/DeviceConnectionModal";
import CrashDetectionComponent from "../components/CrashDetectionComponent";
import { useHelmets } from "../utils/useHelmets";
import { useAuth } from "../utils/useAuth";

export default function AddChild({ navigation }: { navigation: any }) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [age, setAge] = useState<number | string | undefined>();
  const [error, setError] = useState<string>("");

  const { allHelmets, add, addChild } = useHelmets();
  const { addChild_auth } = useAuth();

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    crash,
    setCrash,
  } = useBLE();

  // Implement your logic to add the child with the provided information
  // You can use an API call or any other method to handle this
  function handleAddChild() {
    // TODO: Replace console logs with errors
    if (!connectedDevice || !firstName || !lastName || !age) {
      return setError("All fields must be set up");
    }

    if (isNaN(Number(age))) {
      return setError("Age must be a number");
    }

    if (allHelmets.some((helmet) => helmet.id == connectedDevice.id)) {
      disconnectFromDevice();
      return setError("This helmet is already set up");
    }

    const child = {
      first_name: firstName,
      last_name: lastName,
      age: Number(age),
      helmet_id: connectedDevice.id,
    };

    add({ id: connectedDevice.id });
    addChild(child);
    addChild_auth(child);

    // Reset the form fields
    setFirstName("");
    setLastName("");
    setAge(undefined);

    navigation.goBack();
  }

  return (
    <View>
      <Text style={styles.title}>Child Information</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Age"
        value={!!age ? age + "" : ""}
        onChangeText={(value) => setAge(value)}
      />
      <Text style={styles.error}>{error}</Text>
      {/* !!age ? age + "" : "" */}
      <TouchableOpacity
        onPress={
          connectedDevice
            ? () => {
                disconnectFromDevice();
                openModal();
              }
            : openModal
        }
        style={{
          ...styles.ctaButton,
          backgroundColor: connectedDevice ? "#808080" : "#FF6060",
        }}
      >
        <Text style={styles.ctaButtonText}>
          {!!connectedDevice ? "Helmet Connected" : "Connect Helmet"}
        </Text>
      </TouchableOpacity>

      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />

      <Button title="Add Child" onPress={handleAddChild} />
      <CrashDetectionComponent setShowModal={setCrash} showModal={crash} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  ctaButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  addButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f2f2f2",
//   },
//   heartRateTitleWrapper: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   heartRateTitleText: {
//     fontSize: 30,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginHorizontal: 20,
//     color: "black",
//   },
//   heartRateText: {
//     fontSize: 25,
//     marginTop: 15,
//   },
//   ctaButton: {
//     backgroundColor: "#FF6060",
//     justifyContent: "center",
//     alignItems: "center",
//     height: 50,
//     marginHorizontal: 20,
//     marginBottom: 5,
//     borderRadius: 8,
//   },
//   ctaButtonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
//   crashCountdownWrapper: {
//     alignItems: "center",
//     marginTop: 10,
//   },
//   crashCountdownText: {
//     fontSize: 18,
//     color: "red",
//     marginBottom: 5,
//   },
//   cancelCrashButton: {
//     backgroundColor: "#FF6060",
//     justifyContent: "center",
//     alignItems: "center",
//     height: 40,
//     borderRadius: 8,
//   },
//   cancelCrashButtonText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "white",
//   },
// });
