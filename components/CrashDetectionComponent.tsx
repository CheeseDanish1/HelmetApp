import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { crashDetected } from "../utils/api";

interface CrashDetectionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

/* Pass the crash and setCrash variables in */
const CrashDetectionComponent: React.FC<CrashDetectionProps> = ({
  showModal,
  setShowModal,
}) => {
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (showModal) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [showModal]);

  const startCrashDetection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowModal(true);
  };

  const cancelCrashDetection = () => {
    setShowModal(false);
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === 0) {
      console.log("Crash detected");
      setShowModal(false);
      setCountdown(5);
      crashDetected();
    }
  }, [countdown]);

  useEffect(() => {
    if (showModal) {
      startCrashDetection();
    }
  }, [showModal]);

  return (
    <View>
      {/* <TouchableOpacity onPress={startCrashDetection}>
        <Text>Start Crash Detection</Text>
      </TouchableOpacity> */}

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.background}>
          <View style={styles.container}>
            <Text style={styles.alertText}>A CRASH HAS BEEN DETECTED</Text>
            <Text style={styles.countdown}>Countdown: {countdown}</Text>
            <TouchableOpacity onPress={cancelCrashDetection}>
              <Text style={styles.cancelButton}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
  countdown: { fontSize: 16, marginBottom: 10 },
  alertText: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "red", // Add a red border for emphasis
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.8)", // Change the background color to red for urgency
  },
  simulation: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default CrashDetectionComponent;
