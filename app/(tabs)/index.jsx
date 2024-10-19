import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AppMapview from "./../Mapview";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Send SOS call function - triggers the API call to send an SOS alert
const sendSOSCall = async () => {
  try {
    const response = await fetch('http://172.29.49.198:3000/callSOS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // No location data sent
    });

    // Log the response for debugging
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const text = await response.text();
    console.log('Response text:', text);

    // Attempt to parse the response and handle success or error accordingly
    try {
      const result = JSON.parse(text);
      console.log('SOS call response:', result);
      Alert.alert('Success', 'SOS call initiated successfully');
    } catch (parseError) {
      console.log('Error parsing JSON:', parseError);
      Alert.alert('Error', 'Received invalid response from server');
    }
  } catch (error) {
    // Handle network or other errors
    console.log('Error sending SOS call:', error);
    Alert.alert('Error', 'Failed to send SOS call');
  }
};

const HomeScreen = () => {
  const router = useRouter();

  // This function asks for confirmation before sending the SOS call
  // const handleSOSPress = () => {
  //   Alert.alert("SOS", "Are you sure you want to send an SOS?", [
  //     {
  //       text: "Cancel",
  //       style: "cancel",
  //     },
  //     {
  //       text: "Yes",
  //       onPress: sendSOSCall, // Use function reference, not invocation
  //     },
  //   ]);
  // };

  return (
    <>
      <StatusBar backgroundColor="#ccc" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header with menu and notification icons */}
          <View style={styles.header}>
            <Ionicons name="menu" size={wp("6%")} color="#6b63f6" />
            <Image
              source={require("../../assets/images/logo-3.png")}
              style={styles.logo}
            />
            <Ionicons
              name="notifications"
              size={wp("6%")}
              color="#6b63f6"
              style={styles.notificationIcon}
            />
          </View>

          {/* Section to add friends for SOS and tracking */}
          <View style={styles.header2}>
            <Text style={styles.Text1}>Add Friends</Text>
            <View style={styles.friendContainer}>
              <Text style={styles.friendInfo}>
                Add a friend to use SOS and Track them.
              </Text>
              {/* Navigate to Add Friend screen */}
              <TouchableOpacity onPress={() => router.replace("Addfriend")}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Add Friends</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Map view displaying current location or other data */}
          <View style={styles.content}>
            <AppMapview />
          </View>

          {/* SOS Button - initiates the SOS call */}
          <TouchableOpacity style={styles.sosButton} onPress={sendSOSCall}>
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    height: hp("8%"),
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    alignItems: "center",
    elevation: 4,
    marginTop: hp("4%"),
  },
  header2: {
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    backgroundColor: "#f2f2f2",
    borderRadius: wp("2%"),
    marginVertical: hp("1%"),
  },
  friendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  friendInfo: {
    fontSize: wp("3.4%"),
    color: "#333",
    width: wp("60%"),
  },
  button: {
    backgroundColor: "#6B63F6",
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("4%"),
    borderRadius: wp("2%"),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  notificationIcon: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  logo: {
    width: wp("25%"),
    height: wp("25%"),
    resizeMode: "contain",
  },
  sosButton: {
    position: "absolute",
    right: wp("5%"),
    bottom: hp("3%"),
    backgroundColor: "#DB2B39",
    borderRadius: wp("10%"),
    width: wp("20%"),
    height: wp("20%"),
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosButtonText: {
    color: "white",
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
  Text1: {
    color: "black",
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
});
