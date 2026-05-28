import React, { useState } from "react";
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from "react-native";

export default function App() {
  const [originPincode, setOriginPincode] = useState("");
  const [destinationPincode, setDestinationPincode] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [volumetricWeight, setVolumetricWeight] = useState("");
  const [billedWeight, setBilledWeight] = useState("");
  const [loading, setLoading] = useState(false);
const [shipmentFare, setShipmentFare] = useState("");

  const isFormValid =
  originPincode &&
  destinationPincode &&
  length &&
  breadth &&
  height;

  const calculateWeight = async () => {
  const l = parseFloat(length);
  const b = parseFloat(breadth);
  const h = parseFloat(height);

  if (!l || !b || !h) {
    Alert.alert("Invalid Input", "Please enter valid dimensions.");
    return;
  }

  const volumetric = (l * b * h) / 5000;
  const billed = Math.ceil(volumetric * 2) / 2;

  setLoading(true);

  try {
    const response = await fetch(
      "http://apidev.vyomxpress.com/vendor/order/shipmentFare",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "7f3a1c6e9b12d48f88aebf75c2a341dc",
          Authorization: "Bearer YOUR_TOKEN_HERE",
        },
        body: JSON.stringify({
          originPincode,
          destinationPincode,
          length: l,
          breadth: b,
          height: h,
          billedWeight: billed,
        }),
      }
    );

    const data = await response.json();

    console.log("API Response:", data);

    setVolumetricWeight(volumetric.toFixed(2));
    setBilledWeight(billed.toFixed(2));

    if (data?.shipmentFare) {
      setShipmentFare(data.shipmentFare.toString());
    }

  } catch (error) {
    console.log("API Error:", error);
    Alert.alert("Error", "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
  setOriginPincode("");
  setDestinationPincode("");
  setLength("");
  setBreadth("");
  setHeight("");
  setVolumetricWeight("");
  setBilledWeight("");
  setShipmentFare("");
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vyomxpress Rate Calculator</Text>

      <Text style={styles.label}>Origin Pincode</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Origin Pincode"
        value={originPincode}
        onChangeText={setOriginPincode}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Destination Pincode</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Destination Pincode"
        value={destinationPincode}
        onChangeText={setDestinationPincode}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Length</Text>
          <TextInput
            style={styles.input}
            placeholder="Length"
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Breadth</Text>
          <TextInput
            style={styles.input}
            placeholder="Breadth"
            value={breadth}
            onChangeText={setBreadth}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.label}>Height</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Height"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[
          styles.button,
          !isFormValid && styles.disabledButton,
        ]}
        onPress={calculateWeight}
        disabled={!isFormValid} >
          <Text style={styles.buttonText}>
          {loading ? "Calculating..." : "Calculate"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={resetForm}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>

      <View style={styles.resultCard}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Volumetric Weight</Text>
          <Text style={styles.resultValue}>
            {volumetricWeight ? `${volumetricWeight} kg` : "--"}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Billed Weight</Text>
          <Text style={styles.resultValue}>
            {billedWeight ? `${billedWeight} kg` : "--"}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Shipment Fare</Text>
          <Text style={styles.resultValue}>
            {shipmentFare ? `₹${shipmentFare}` : "--"}
          </Text>
        </View>

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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfInputContainer: {
    width: "48%",
  },

  button: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  
  disabledButton: {
    backgroundColor: "#9ca3af",
  },

  clearButton: {
    backgroundColor: "#e5e7eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  clearButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
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

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  resultLabel: {
    fontSize: 16,
    color: "#4b5563",
  },

  resultValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
});