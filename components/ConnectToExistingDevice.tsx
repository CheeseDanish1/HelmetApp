import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useBLE } from "../utils/useBLE"; // Make sure to adjust the path to your useBLE.ts file

interface Props {
  deviceIds: string[];
}

const ConnectToExistingDevice: React.FC<Props> = ({ deviceIds }) => {
  const {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
  } = useBLE();

  const [isPermissionsGranted, setIsPermissionsGranted] =
    useState<boolean>(false);

  useEffect(() => {
    requestPermissions().then(setIsPermissionsGranted);
  }, []);

  useEffect(() => {
    if (isPermissionsGranted) {
      scanForPeripherals();
    }
  }, [isPermissionsGranted]);

  return (
    <View>
      {isPermissionsGranted && !connectedDevice && (
        <FlatList
          data={deviceIds}
          keyExtractor={(item: string) => item}
          renderItem={({ item }: { item: string }) => (
            <TouchableOpacity
              onPress={() => connectToDevice(item)}
              style={modalStyle.ctaButton}
            >
              <Text style={modalStyle.ctaButtonText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {!isPermissionsGranted && (
        <Text>Bluetooth permissions are not granted.</Text>
      )}

      {connectedDevice && (
        <TouchableOpacity
          style={modalStyle.ctaButton}
          onPress={disconnectFromDevice}
        >
          <View>
            <Text>Disconnect from {connectedDevice.id}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
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
});

export default ConnectToExistingDevice;
