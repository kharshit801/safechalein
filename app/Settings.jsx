import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, StatusBar, SafeAreaView, Image, Alert ,Platform} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SettingsScreen = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all stored data
              await AsyncStorage.multiRemove(['userData', 'keepSignedIn']);
              // Navigate to login screen
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const SettingItem = ({ icon, title, onPress }) => (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        title === 'Log Out' && styles.logoutItem
      ]} 
      onPress={onPress}
    >
      <Ionicons 
        name={icon} 
        size={wp('6%')} 
        color={title === 'Log Out' ? '#FF3B30' : '#6B63F6'} 
      />
      <Text style={[
        styles.settingText,
        title === 'Log Out' && styles.logoutText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const handleSettingPress = (title) => {
    switch (title) {
      case 'Log Out':
        handleLogout();
        break;
      case 'History':
        break;
      case 'Friends':
        break;
      default:
        break;
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#ccc" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
              <Ionicons name="arrow-back" size={wp('6%')} color="#6b63f6" />
            </TouchableOpacity>
            <Image
              source={require("./../assets/images/logo-3.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.profile}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={wp("6%")} color="#6b63f6" />
              </View>
              <View>
                <Text style={styles.name}>Team Auxin</Text>
                <Text style={styles.phone}>+91 9621456342</Text>
              </View>
            </View>
            <TouchableOpacity style={{paddingLeft: wp('5%')}}>
              <Ionicons name="pencil" size={wp('6%')} color="#6B63F6" />
            </TouchableOpacity>
          </View>

          <View style={styles.sosDevice}>
            <Text style={styles.sosText}>SOS Device</Text>
            <View style={styles.switchContainer}>
              <Text>{isConnected ? 'Connected' : 'Disconnected'}</Text>
              <Switch
                value={isConnected}
                onValueChange={setIsConnected}
                trackColor={{ false: "#767577", true: "#6B63F6" }}
                thumbColor={isConnected ? "#f4f3f4" : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={styles.settingsGrid}>
            <SettingItem icon="time-outline" title="History" onPress={() => handleSettingPress('History')} />
            <SettingItem icon="people-outline" title="Friends" onPress={() => handleSettingPress('Friends')} />
            <SettingItem icon="list-outline" title="Block List" onPress={() => handleSettingPress('Block List')} />
            <SettingItem icon="chatbubble-outline" title="Feedback" onPress={() => handleSettingPress('Feedback')} />
            <SettingItem icon="document-text-outline" title="Legal" onPress={() => handleSettingPress('Legal')} />
            <SettingItem icon="help-circle-outline" title="Help" onPress={() => handleSettingPress('Help')} />
            <SettingItem icon="language-outline" title="Language" onPress={() => handleSettingPress('Language')} />
            <SettingItem icon="settings-outline" title="Settings" onPress={() => handleSettingPress('Settings')} />
            <SettingItem 
              icon="log-out-outline" 
              title="Log Out" 
              onPress={() => handleSettingPress('Log Out')} 
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B63F6',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  
  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
    backgroundColor: 'white',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    margin: wp('4%'),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    borderColor: 'blue',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: '#e0e0e0',
    marginRight: wp('4%'),
  },
  name: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  phone: {
    color: 'gray',
    fontSize: wp('3.5%'),
  },
  sosDevice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    margin: wp('4%'),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosText: {
    fontSize: wp('4%'),
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
    padding: wp('4%'),
  },
  settingItem: {
    width: wp('28%'),
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp('4%'),
  },
  settingText: {
    marginTop: hp('1%'),
    fontSize: wp('3%'),
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    // Add these new styles
    logoutItem: {
      borderWidth: 1,
      borderColor: '#FF3B30',
      backgroundColor: '#FFF',
    },
    logoutText: {
      color: '#FF3B30',
      fontWeight: '500',
    }
});

export default SettingsScreen;
