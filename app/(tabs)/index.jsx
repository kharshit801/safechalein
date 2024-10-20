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
  Switch,
  Platform,
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
  const [countdown, setCountdown] = useState(5);
  const [isSOSCancelled, setIsSOSCancelled] = useState(false);
  const [wellLitAreas, setWellLitAreas] = useState(false);
  const [monitoredAreas, setMonitoredAreas] = useState(false);

  useEffect(() => {
    let timer;
    if (modalVisible && countdown > 0 && !isSOSCancelled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !isSOSCancelled) {
      sendSOSCall();
      setModalVisible(false);
    }
    return () => clearTimeout(timer);
  }, [modalVisible, countdown, isSOSCancelled]);

  const sendSOSCall = async () => {
    try {
      const response = await fetch("https://backendof-sf.vercel.app/callSOS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const text = await response.text();
      console.log("SOS call response:", text);
      Alert.alert("Success", "SOS call initiated successfully");
    } catch (error) {
      console.log("Error sending SOS call:", error);
      Alert.alert("Error", "Failed to send SOS call");
    }
  };

  const handleSOSPress = () => {
    setIsSOSCancelled(false);
    setCountdown(5);
    setModalVisible(true);
  };

  const cancelSOSCall = () => {
    setIsSOSCancelled(true);
    setModalVisible(false);
    Alert.alert("Cancelled", "SOS call has been cancelled");
  };

  return (
    <>
      <StatusBar backgroundColor="#ccc" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Ionicons name="menu" size={wp("6%")} color="#6b63f6" />
              <Image
                source={require("../../assets/images/logo-3.png")}
                style={styles.logo}
              />
              <Ionicons
                name="person"
                size={wp("6%")}
                color="#6b63f6"
                style={styles.notificationIcon}
                onPress={() => router.replace("Settings")}
              />
            </View>

            <View style={styles.header2}>
              <View style={styles.friendContainer}>
                <Text style={styles.Text1}>Add Friends</Text>

                <Text style={styles.friendInfo}>
                  Add a friend to use SOS and Track them.
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => router.replace("Addfriend")}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Add Friends</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            <AppMapview
              wellLitAreas={wellLitAreas}
              monitoredAreas={monitoredAreas}
            />
          </View>

          <View style={styles.preferenceAndSOSContainer}>
            <View style={styles.preferenceContainer}>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Well-Lit Areas:</Text>
                <Switch value={wellLitAreas} onValueChange={setWellLitAreas} />
              </View>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Monitored Areas:</Text>
                <Switch
                  value={monitoredAreas}
                  onValueChange={setMonitoredAreas}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
              <Text style={styles.sosButtonText}>SOS</Text>
            </TouchableOpacity>
          </View>

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    marginVertical:
      Platform.OS === "android" ? StatusBar.currentHeight : hp("3%"),
    
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
  },
  header2: {
    flexDirection: "row",

    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    backgroundColor: "#f2f2f2",
    borderRadius: wp("2%"),
  },
  friendContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "flex-start",
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
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    
    flex: 1,
  },
  logo: {
    width: wp("25%"),
    height: wp("25%"),
    resizeMode: "contain",
  },
  preferenceAndSOSContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp("4%"),
  },
  preferenceContainer: {
    flex: 1,
    marginRight: wp("4%"),
    backgroundColor: "#ffffff", // Pure white background
    padding: wp("2%"),
    borderRadius: wp("2%"),
    elevation: 2, // Add a slight shadow for depth
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  toggleLabel: {
    fontSize: wp("3.5%"),
    color: "#333", // Darker text for better contrast
  },
  sosButton: {
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
    borderRadius: wp("2%"),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  Text1: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
});

export default HomeScreen;
