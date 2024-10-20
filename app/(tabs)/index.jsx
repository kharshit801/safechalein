import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AppMapview from "./../Mapview";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(5); // Set the initial countdown to 5 seconds
  const [isSOSCancelled, setIsSOSCancelled] = useState(false);

  // Effect to handle countdown
  useEffect(() => {
    let timer;
    if (modalVisible && countdown > 0 && !isSOSCancelled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !isSOSCancelled) {
      sendSOSCall();
      setModalVisible(false); // Close modal after sending SOS
    }
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [modalVisible, countdown, isSOSCancelled]);

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

      const text = await response.text();
      console.log('SOS call response:', text);
      Alert.alert('Success', 'SOS call initiated successfully');
    } catch (error) {
      console.log('Error sending SOS call:', error);
      Alert.alert('Error', 'Failed to send SOS call');
    }
  };

  // Function to handle SOS button press
  const handleSOSPress = () => {
    setIsSOSCancelled(false);  // Reset cancellation flag
    setCountdown(5);           // Reset the countdown
    setModalVisible(true);     // Show modal
  };

  // Function to cancel SOS call
  const cancelSOSCall = () => {
    setIsSOSCancelled(true);   // Set cancellation flag
    setModalVisible(false);    // Hide modal
    Alert.alert("Cancelled", "SOS call has been cancelled");
  };

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
              name="settings"
              size={wp("6%")}
              color="#6b63f6"
              style={styles.notificationIcon}
              onPress={() => router.replace("Settings")}
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

          
          <View style={styles.content}>
            <AppMapview />
          </View>

          {/* SOS Button - initiates the SOS call */}
          <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>

          {/* Modal for countdown before sending SOS */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Sending SOS in {countdown} seconds...
                </Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelSOSCall}
                >
                  <Text style={styles.cancelButtonText}>Cancel SOS</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: wp("80%"),
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
  },
  cancelButton: {
    backgroundColor: "#DB2B39",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
});
