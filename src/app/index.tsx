import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function App() {
  const [originPincode, setOriginPincode] = useState("");
  const [destinationPincode, setDestinationPincode] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>TEST APP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Origin Pincode"
        value={originPincode}
        onChangeText={setOriginPincode}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Destination Pincode"
        value={destinationPincode}
        onChangeText={setDestinationPincode}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Length"
        value={length}
        onChangeText={setLength}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Breadth"
        value={breadth}
        onChangeText={setBreadth}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Height"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      <View style={styles.resultCard}>
        <Text style={styles.resultText}>Volumetric Weight: --</Text>
        <Text style={styles.resultText}>Billed Weight: --</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  resultCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },

  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
});