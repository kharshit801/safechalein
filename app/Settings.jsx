import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, StatusBar, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SettingsScreen = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const router = useRouter(); // Use the router hook

  const SettingItem = ({ icon, title }) => (
    <TouchableOpacity style={styles.settingItem}>
      <Ionicons name={icon} size={24} color="#8e44ad" />
      <Text style={styles.settingText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar backgroundColor="#ccc" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("index")}>
              <Ionicons name="arrow-back" size={24} color="#6b63f6" />
            </TouchableOpacity>
            <Image
              source={require("./../assets/images/logo-3.png")} // Adjust the path accordingly
              style={styles.logo}
            />
          </View>

          <View style={styles.profile}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.name}>User</Text>
              <Text style={styles.phone}>+91 9621......</Text>
            </View>
            <TouchableOpacity style={{paddingLeft:wp("5%")}}>
              <Ionicons name="pencil" size={24} color="#8e44ad" />
            </TouchableOpacity>
          </View>

          <View style={styles.sosDevice}>
            <Text style={styles.sosText}>SOS Device</Text>
            <View style={styles.switchContainer}>
              <Text>{isConnected ? 'Connected' : 'Disconnected'}</Text>
              <Switch
                value={isConnected}
                onValueChange={setIsConnected}
                trackColor={{ false: "#767577", true: "#8e44ad" }}
                thumbColor={isConnected ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={styles.settingsGrid}>
            <SettingItem icon="time-outline" title="History" />
            <SettingItem icon="people-outline" title="Friends" />
            <SettingItem icon="list-outline" title="Block List" />
            <SettingItem icon="chatbubble-outline" title="Feedback" />
            <SettingItem icon="document-text-outline" title="Legal" />
            <SettingItem icon="help-circle-outline" title="Help" />
            <SettingItem icon="language-outline" title="Language" />
            <SettingItem icon="settings-outline" title="Settings" />
            <SettingItem icon="log-out-outline" title="Log Out" />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8e44ad',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    color: 'gray',
  },
  sosDevice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  sosText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
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
});

export default SettingsScreen;
