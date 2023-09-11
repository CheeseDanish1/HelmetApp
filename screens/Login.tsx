import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../utils/useAuth";
import Logout from "../components/Logout";
import ErrorMessage from "../components/ErrorMessage";

export default function Login({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, isLoading, signin, setSigninError, signinError } = useAuth();

  const handleLogin = () => {
    if (isLoading) return;
    signin({ email, password });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setSigninError([]);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: isLoading ? "#808080" : "#007bff",
        }}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>{"Login"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <ErrorMessage errors={signinError} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  switchText: {
    marginTop: 10,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
