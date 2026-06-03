import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [originPincode, setOriginPincode] = useState("");
  const [destinationPincode, setDestinationPincode] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");

  const [volumetricWeight, setVolumetricWeight] = useState("");
  const [billedWeight, setBilledWeight] = useState("");
  const [shipmentFare, setShipmentFare] = useState("");

  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [shippingCharge, setShippingCharge] = useState("");
  const [gstCharge, setGstCharge] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [providerName, setProviderName] = useState("");
  const [tat, setTat] = useState("");
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const isFormValid =
    originPincode &&
    destinationPincode &&
    length &&
    breadth &&
    height;

  useEffect(() => {
  checkLogin();

  const timer = setTimeout(() => {
    setShowSplash(false);
  }, 2000);

  return () => clearTimeout(timer);
  }, []);

  const theme = {
    background: isDarkMode ? "#111827" : "#ffffff",
    card: isDarkMode ? "#1f2937" : "#f3f4f6",
    text: isDarkMode ? "#ffffff" : "#111827",
    subText: isDarkMode ? "#d1d5db" : "#4b5563",
    input: isDarkMode ? "#374151" : "#ffffff",
    border: isDarkMode ? "#4b5563" : "#d1d5db",
  };

  const loginVendor = async () => {
  try {
    const response = await fetch(
      "https://apidev.vyomxpress.com/vendor/login",
      {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "x-api-key":
      "7f3a1c6e9b12d48f88aebf75c2a341dc",
      },
      body: JSON.stringify({
      email,
      password,
      }),
    }
  );

  const data = await response.json();
  console.log("LOGIN RESPONSE:", data);

  if (data?.status === "success") {

  await AsyncStorage.setItem(
  "vendorToken",
  data.data.token
  );

  setToken(data.data.token);
  setIsLoggedIn(true);

  Alert.alert(
  "Success",
  "Login Successful"
  ); 
  }else {
      Alert.alert(
        "Login Failed",
        data?.message || "Invalid credentials"
      );
    }
  } catch (error) {
    console.log(error);

    Alert.alert(
      "Error",
      "Unable to login"
    );
  }
};
  const checkLogin = async () => {
  try {
    const savedToken =
    await AsyncStorage.getItem("vendorToken");

    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  } catch (error) {
  console.log(error);
  }
};

  const logout = async () => {
  try {
    await AsyncStorage.removeItem("vendorToken");

    setToken("");
    setIsLoggedIn(false);

    Alert.alert("Success", "Logged out successfully");
  } catch (error) {
    console.log(error);
  }
};


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
  `https://apidev.vyomxpress.com/vendor/order/shipmentFare?receiverPincode=${destinationPincode}&originPincode=${originPincode}&height=${h}&width=${b}&length=${l}&weight=500&codAmount=0`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key":
        "7f3a1c6e9b12d48f88aebf75c2a341dc",
    },
    }
  );

    const data = await response.json();

    console.log("API Response:", data);

    setVolumetricWeight(volumetric.toFixed(2));
    setBilledWeight(billed.toFixed(2));

    if (
  data?.status === "success" &&
  data?.data?.length > 0){

  setShippingOptions(data.data);

  const cheapest = data.data.reduce(
    (prev: any, curr: any) =>
    (prev.totalFare || Infinity) <
    (curr.totalFare || Infinity)
    ? prev
    : curr
  );

  setShipmentFare(
    cheapest.totalFare?.toFixed(2) || "--"
  );

  setShippingCharge(
    cheapest.baseFare?.toFixed(2) || "--"
  );

  setGstCharge(
    cheapest.gstFare?.toFixed(2) || "--"
  );

  setTotalCost(
    cheapest.totalFare?.toFixed(2) || "--"
  );

  setProviderName(
    cheapest.name || "--"
  );

  setTat(
    cheapest.tat
      ? `${cheapest.tat} Days`
      : "--"
  );
}} catch (error) {
    console.log("API Error:", error);

    Alert.alert(
      "Error",
      "Something went wrong."
    );
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
    setShippingCharge("");
    setShippingCharge("");
    setGstCharge("");
    setTotalCost("");
    setProviderName("");
    setTat("");
    setShippingOptions([]);
  };

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashTitle}>VyomXpress</Text>
        <Text style={styles.splashSubtitle}>
        Smart Shipping Solutions
        </Text>
      </View>
    );
  }
  if (!isLoggedIn) {
  return (
  <View
    style={{
    flex: 1,
    justifyContent: "center",
    padding: 20,
  }}>
  <Text
   style={{
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  }}>
   VyomXpress Login
  </Text>
    <TextInput
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      style={styles.input}/>

      <TextInput
      placeholder="Password"
      secureTextEntry
      value={password}
      onChangeText={setPassword}
      style={styles.input}/>

      <TouchableOpacity
      style={styles.button}
      onPress={loginVendor}>
      <Text style={styles.buttonText}>
      Login
      </Text>
      </TouchableOpacity>
    </View>
  );
}

 return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Vyomxpress Rate Calculator
      </Text>

        <TouchableOpacity
      onPress={logout}
      style={{
        alignSelf: "flex-end",
        backgroundColor: "#ff4d4f",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 15,
    }}>
      <Text
        style={{
        color: "#fff",
        fontWeight: "bold",
        }}>
        Logout
      </Text>
    </TouchableOpacity>

      <TouchableOpacity
        style={styles.darkModeToggle}
        onPress={() => setIsDarkMode(!isDarkMode)}>
        <Text style={styles.darkModeIcon}>
          {isDarkMode ? "☀️" : "🌙"}
      </Text>
      </TouchableOpacity>

      <Text style={[styles.label, { color: theme.subText }]}>
        Origin Pincode
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.input,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Enter Origin Pincode"
        placeholderTextColor={theme.subText}
        value={originPincode}
        onChangeText={setOriginPincode}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: theme.subText }]}>
        Destination Pincode
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.input,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Enter Destination Pincode"
        placeholderTextColor={theme.subText}
        value={destinationPincode}
        onChangeText={setDestinationPincode}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={[styles.label, { color: theme.subText }]}>
            Length
          </Text>

    <TextInput
      style={[
      styles.input,
      {
      backgroundColor: theme.input,
      borderColor: theme.border,
      color: theme.text,
      },
      ]}
      placeholder="Length"
      placeholderTextColor={theme.subText}
      value={length}
      onChangeText={setLength}
      keyboardType="numeric"/>
    </View>

  <View style={styles.halfInputContainer}>
  <Text style={[styles.label, { color: theme.subText }]}>
    Breadth
    </Text>

    <TextInput
      style={[
      styles.input,
        {
        backgroundColor: theme.input,
        borderColor: theme.border,
        color: theme.text,
        },
      ]}
      placeholder="Breadth"
      placeholderTextColor={theme.subText}
      value={breadth}
      onChangeText={setBreadth}
      keyboardType="numeric"/>
  </View>
</View>

  <Text style={[styles.label, { color: theme.subText }]}>
    Height
  </Text>

  <TextInput
    style={[
      styles.input,
      {
        backgroundColor: theme.input,
        borderColor: theme.border,
        color: theme.text,
      },
    ]}
    placeholder="Enter Height"
    placeholderTextColor={theme.subText}
    value={height}
    onChangeText={setHeight}
    keyboardType="numeric"/>

      <TouchableOpacity
        style={[
          styles.button,
          !isFormValid && styles.disabledButton,
        ]}
        onPress={calculateWeight}
        disabled={!isFormValid}>
        <Text style={styles.buttonText}>
          {loading ? "Calculating..." : "Calculate"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={resetForm}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>

  <View
    style={[
    styles.resultCard,
    { backgroundColor: theme.card },
    ]}>
    <View style={styles.resultRow}>
      <Text
      style={[
      styles.resultLabel,
      { color: theme.subText },
      ]}>
      Volumetric Weight
      </Text>

  <Text
    style={[
    styles.resultValue,
    { color: theme.text },
    ]}>
    {volumetricWeight
    ? `${volumetricWeight} kg`
    : "--"}
  </Text>
</View>

<View style={styles.resultRow}>
   <Text
    style={[
    styles.resultLabel,
    { color: theme.subText },
    ]}>
    Billed Weight
     </Text>
    <Text
      style={[
      styles.resultValue,
      { color: theme.text },
      ]}>
      {billedWeight ? `${billedWeight} kg` : "--"}
    </Text>
   </View>

        <View style={styles.resultRow}>
    <Text
      style={[
      styles.resultLabel,
      { color: theme.subText },
      ]}>
      Shipment Fare
    </Text>
    <Text
      style={[
      styles.resultValue,
      { color: theme.text },
      ]}>
      {shipmentFare ? `₹${shipmentFare}` : "--"}
    </Text>
  </View>
<View style={styles.resultRow}>

    <Text
    style={[
    styles.resultLabel,
    { color: theme.subText },
    ]}>
    Courier Partner
    </Text>

  <Text
    style={[
      styles.resultValue,
      { color: theme.text },
    ]}>
    {providerName || "--"}
  </Text>
</View>

<View style={styles.resultRow}>
  <Text
    style={[
      styles.resultLabel,
      { color: theme.subText },
    ]}>
    Shipping Charge
  </Text>

  <Text
    style={[
    styles.resultValue,
    { color: theme.text },
    ]}>
    {shippingCharge ? `₹${shippingCharge}` : "--"}
  </Text>
  </View>

  <View style={styles.resultRow}>
    <Text
    style={[
    styles.resultLabel,
      { color: theme.subText },
    ]}>
    GST
    </Text>

  <Text
    style={[
    styles.resultValue,
    { color: theme.text },
    ]}>
    {gstCharge ? `₹${gstCharge}` : "--"}
      </Text>
    </View>

<View style={styles.resultRow}>
  <Text
    style={[
    styles.resultLabel,
      { color: theme.subText },
    ]}>
    Total Cost
    </Text>
    <Text
      style={[
      styles.resultValue,
      { color: theme.text },
      ]}>
      {totalCost ? `₹${totalCost}` : "--"}
    </Text>
  </View>

  <View style={styles.resultRow}>
    <Text
      style={[
      styles.resultLabel,
      { color: theme.subText },
      ]}>
      Delivery Time
    </Text>
    <Text
      style={[
      styles.resultValue,
      { color: theme.text },
      ]}>
      {tat || "--"}
      </Text>
        </View>
      {shippingOptions.length > 0 && (
  <View
    style={[
      styles.resultCard,
      { backgroundColor: theme.card },
    ]}>
    <Text
      style={{
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      color: theme.text,
    }}>
      Available Shipping Options
    </Text>

    {shippingOptions.map(
      (option: any, index: number) => (
      
    <View
      key={index}
      style={{
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.border,
   }}>
    <Text
      style={{
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      }}>
      {option.name}
    </Text>
    <Text
      style={{
      color: theme.subText,
      marginTop: 5,
      }}>
      Base Fare: ₹{option.baseFare}
    </Text>
    <Text
      style={{
      color: theme.subText,
      }}>
      GST: ₹{option.gstFare}
    </Text>
    <Text
      style={{
      color: theme.subText,
      }}>
      Total Cost: ₹{option.totalFare}
    </Text>
    <Text
      style={{
      color: theme.subText,
      }}>
      TAT: {option.tat} Days
    </Text>
  </View>
)
)}
</View>
)}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  darkModeToggle: {
  position: "absolute",
  top: 15,
  right: 15,
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#000",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
  },

  darkModeIcon: {
  fontSize: 22,
  color: "#fff",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
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

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
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

  resultCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  resultLabel: {
    fontSize: 16,
  },

  resultValue: {
    fontSize: 18,
    fontWeight: "bold",
  },

  splashContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },

  splashTitle: {
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "bold",
  },

  splashSubtitle: {
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 10,
  },
});