import React, { createContext, useContext, useMemo, useState } from "react";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const DEVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const DEVICE_CHARACTERISTIC = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

interface BLEContextType {
  scanForPeripherals: () => void;
  requestPermissions: () => Promise<boolean>;
  allDevices: Device[];
  connectToDevice: (device: Device | string) => void;
  connectedDevice: Device | null;
  disconnectFromDevice: () => void;
  crash: boolean;
  setCrash: React.Dispatch<React.SetStateAction<boolean>>;
}

const BLEContext = createContext<BLEContextType>(undefined!);
export function BLEProvider({ children }: { children: any }) {
  const bleManager = useMemo(() => new BleManager(), []);

  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [crash, setCrash] = useState<boolean>(false);

  async function requestAndroid31Permissions() {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Scan Permission",
        message: "App Requires Bluetooth Scanning",
        buttonPositive: "OK",
      }
    );

    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Scan Permission",
        message: "App Requires Bluetooth Connecting",
        buttonPositive: "OK",
      }
    );

    const bluetoothFineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Fine Location ",
        message: "App Requires Fine Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothConnectPermission === "granted" &&
      bluetoothScanPermission === "granted" &&
      bluetoothFineLocationPermission === "granted"
    );
  }

  async function requestPermissions() {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth requires location",
            buttonPositive: "OK",
          }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionGranted =
          await requestAndroid31Permissions();
        return isAndroid31PermissionGranted;
      }
    } else {
      return true;
    }
  }

  function isDuplicateDevice(devices: Device[], nextDevice: Device) {
    return devices.findIndex((device) => nextDevice.id === device.id) > -1;
  }

  function scanForPeripherals() {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scanning error: ", error);
      }

      if (device && device.name?.includes("SafeRide")) {
        setAllDevices((prev) => {
          if (!isDuplicateDevice(prev, device)) {
            return [...prev, device];
          } else {
            return prev;
          }
        });
      }
    });
  }

  const connectToDevice = async (device: Device | string) => {
    try {
      const deviceId = typeof device === "string" ? device : device.id;
      const deviceConnection = await bleManager.connectToDevice(deviceId);
      setConnectedDevice(deviceConnection);
      setAllDevices([]);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("Error in Connection: ", e);
    }
  };

  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    console.log("Received");
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log("No Data Received");
      return;
    }

    const rawData = base64.decode(characteristic.value);
    let innerData: any = -1;
    if (rawData.length > 1) innerData = rawData;
    else innerData = rawData.charCodeAt(0);
    if (rawData == "crash=true") {
      setCrash(true);
    }
  };

  const sendMessageToDevice = async (device: Device, message: string) => {
    if (device) {
      try {
        await device.writeCharacteristicWithResponseForService(
          DEVICE_UUID,
          DEVICE_CHARACTERISTIC,
          base64.encode(message)
        );
      } catch (error) {
        console.log("Error sending message: ", error);
      }
    } else {
      console.log("No Device Connected");
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        DEVICE_UUID,
        DEVICE_CHARACTERISTIC,
        onDataUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);

      // TODO: Reset all state here
      setCrash(false);
    }
  };

  const contextValue: BLEContextType = {
    scanForPeripherals,
    requestPermissions,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    crash,
    setCrash,
  };

  return (
    <BLEContext.Provider value={contextValue}>{children}</BLEContext.Provider>
  );
}

export const useBLE = () => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error("useBLEContext must be used within a BLEProvider");
  }
  return context;
};
