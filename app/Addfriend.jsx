import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Contacts from 'expo-contacts'; // Import expo-contacts

const Addfriends = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleSave = () => {
    alert(`Friend's number saved: ${phoneNumber}`);
  };

  // Function to access the phone's contact list
  const handleAccessDirectory = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    
    if (status === 'granted') {
      // Get the user's contacts
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const contact = data[0]; 
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          setPhoneNumber(contact.phoneNumbers[0].number); // Set phone number from contact
          Alert.alert(`Contact selected: ${contact.name}`);
        } else {
          Alert.alert("This contact has no phone numbers");
        }
      } else {
        Alert.alert("No contacts found");
      }
    } else {
      Alert.alert("Permission to access contacts was denied");
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#ccc" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons
              name="arrow-back"
              size={wp("6%")}
              color="#6b63f6"
            onPress={() => router.replace("index")}
            />
            <Image
              source={require("./././../assets/images/logo-3.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.centeredContent}>
            <Text style={styles.title}>Add Friend</Text>
            <Ionicons
              name="people-outline"
              color="#6B63F6"
              size={100}
              style={styles.icon}
            />

            <View style={styles.inputRow}> 
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="+91-"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              <TouchableOpacity
                style={styles.contactIconContainer}
                onPress={handleAccessDirectory}
              >
                <Ionicons
                  name="phone-portrait-outline"
                  size={wp("8%")}  
                  color="#6B63F6"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Addfriends;

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
    gap: wp("25%"),
    alignItems: "center",
    paddingHorizontal: wp("3%"),
    elevation: 4,
    marginTop: hp("4%"),
  },
  centeredContent: {
    flex: 1,
    marginTop: hp("10%"),
    alignItems: "center",
  },
  title: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
  },
  logo: {
    width: wp("28%"),
    height: wp("28%"),
    resizeMode: "contain",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp("2%"),
    justifyContent: "center",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    padding: wp("2%"),
    width: wp("70%"), 
  },
  input: {
    fontSize: wp("4%"),
    paddingHorizontal: wp("2%"),
    color: "#333",
  },
  contactIconContainer: {
    marginLeft: wp("3%"), 
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#6B63F6",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("10%"),
    borderRadius: wp("2%"),
    marginTop: hp("2%"),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
});
