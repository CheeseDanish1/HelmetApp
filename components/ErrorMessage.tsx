import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ErrorMessage = ({ errors }: { errors: any }) => {
  if (!errors || errors.length < 1) return <></>;

  return (
    <View>
      {errors.map((error: any, index: number) => (
        <Text key={index} style={styles.errorText}>
          {error}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default ErrorMessage;
