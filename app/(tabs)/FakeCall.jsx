import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Vibration,
  ScrollView,
  Modal,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Ionicons } from '@expo/vector-icons';
import IncomingCallScreen from '../widget/incomingcall'; 
import OngoingCallScreen from "../widget/ongoingcall"

const FakeCallScreen = () => {
  const [calls, setCalls] = useState([]);
  const [activeCalls, setActiveCalls] = useState([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [callDelay, setCallDelay] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [showOngoingCall, setShowOngoingCall] = useState(false);
  const [sound, setSound] = useState();
  const [isConferenceActive, setIsConferenceActive] = useState(false);

  const delayOptions = [
    { label: '5 sec', value: 5 },
    { label: '10 sec', value: 10 },
    { label: '1 min', value: 60 },
    { label: '5 min', value: 300 },
  ];

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playRingtone = async () => {
    try {
      const { sound: ringSound } = await Audio.Sound.createAsync(
        require('../../assets/ringtone.mp3'),
        { 
          isLooping: true,
          shouldPlay: true,
        }
      );
      setSound(ringSound);
      await ringSound.playAsync();
    } catch (error) {
      console.error('Error playing ringtone:', error);
      alert('Failed to play ringtone. Please check your device settings.');
    }
  };

  const startFakeCall = async () => {
    if (!name || !number || !callDelay) {
      alert('Please fill in all details and select a timer');
      return;
    }

    const newCall = { id: Date.now(), name, number, image: selectedImage };
    setCalls([...calls, newCall]);

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error setting audio mode:', error);
      alert('Failed to set audio mode. The call may not work as expected.');
    }

    setTimeout(async () => {
      try {
        await playRingtone();
        Vibration.vibrate([1000, 2000, 1000], true);
        setShowIncomingCall(true);
      } catch (error) {
        console.error('Error starting fake call:', error);
        alert('Failed to start the fake call. Please try again.');
      }
    }, callDelay * 1000);
  };

  // const handleAcceptCall = async (call) => {
  //   try {
  //     if (sound) {
  //       await sound.stopAsync();
  //       await sound.unloadAsync();
  //       setSound(null);
  //     }
  //     Vibration.cancel();
  //     setShowIncomingCall(false);
  //     setActiveCalls([...activeCalls, { ...call, isOnHold: false }]);
  //     setShowOngoingCall(true);
  //   } catch (error) {
  //     console.error('Error accepting call:', error);
  //     Alert.alert('Failed to accept the call properly. Please try again.');
  //   }
  // };

  const handleAcceptCall = async (call) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      Vibration.cancel();
      setShowIncomingCall(false);
      setActiveCalls([...activeCalls, { 
        ...call, 
        isOnHold: false,
        id: call.id || Date.now(),
        startTime: new Date() // Add this line
      }]);
      setShowOngoingCall(true);
    } catch (error) {
      console.error('Error accepting call:', error);
      Alert.alert('Error', 'Failed to accept the call properly. Please try again.');
    }
  };
  
  const handleDeclineCall = async (callId) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      Vibration.cancel();
      setShowIncomingCall(false);
      setCalls(calls.filter(call => call.id !== callId));
    } catch (error) {
      console.error('Error declining call:', error);
      alert('Failed to decline the call properly. Please try again.');
    }
  };

  const handleEndOngoingCall = (callId) => {
    setActiveCalls(activeCalls.filter(call => call.id !== callId));
    if (activeCalls.length === 1) {
      setShowOngoingCall(false);
      setIsConferenceActive(false);
    }
  };

  const handleHoldCall = (callId) => {
    setActiveCalls(activeCalls.map(call => 
      call.id === callId ? { ...call, isOnHold: !call.isOnHold } : call
    ));
  };

  const startConference = () => {
    if (activeCalls.length > 1) {
      setIsConferenceActive(true);
    } else {
      alert('You need at least two active calls to start a conference.');
    }
  };

  const endConference = () => {
    setIsConferenceActive(false);
  };

  const renderIncomingCallScreen = () => {
    const currentCall = calls[calls.length - 1];
    
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showIncomingCall}
        onRequestClose={() => setShowIncomingCall(false)}
      >
        <IncomingCallScreen
          caller={{
            name: currentCall?.name || '',
            number: currentCall?.number || '',
            image: currentCall?.image || null
          }}
          onAccept={() => handleAcceptCall(currentCall)}
          onDecline={() => handleDeclineCall(currentCall?.id)}
        />
      </Modal>
    );
  };

// In FakeCall.jsx, update the renderOngoingCallScreen function:

const renderOngoingCallScreen = () => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={showOngoingCall}
    onRequestClose={() => setShowOngoingCall(false)}
  >
    <OngoingCallScreen
      calls={activeCalls}
      isConferenceActive={isConferenceActive}
      onHoldCall={(callId) => handleHoldCall(callId)}
      onEndCall={(callId) => handleEndOngoingCall(callId)}
      onStartConference={startConference}
      onEndConference={endConference}
    />
  </Modal>
);

  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Caller Details</Text>
            <Text style={styles.headerSubtitle}>
              Specify time and caller details to schedule a fake call.
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Set up caller image</Text>
            <View style={styles.imageOptions}>
              <TouchableOpacity style={styles.imageOption}>
                <View style={styles.iconContainer}>
                  <Ionicons name="camera" size={30} color="#666" />
                </View>
                <Text style={styles.optionLabel}>Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.imageOption}>
                <View style={styles.iconContainer}>
                  <Ionicons name="images" size={30} color="#666" />
                </View>
                <Text style={styles.optionLabel}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.imageOption}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person" size={30} color="#666" />
                </View>
                <Text style={styles.optionLabel}>Preset</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Set up a fake caller</Text>
            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.contactIcon}>
                  <Ionicons name="person-add" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={number}
                  onChangeText={setNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.contactIcon}>
                  <Ionicons name="call" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pre-set timer</Text>
            <View style={styles.timerGrid}>
              {delayOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.timerButton,
                    callDelay === option.value && styles.selectedTimer
                  ]}
                  onPress={() => setCallDelay(option.value)}
                >
                  <Text style={[
                    styles.timerText,
                    callDelay === option.value && styles.selectedTimerText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.callMeButton}
            onPress={startFakeCall}
          >
            <Text style={styles.callMeButtonText}>Schedule Fake Call</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showIncomingCall && renderIncomingCallScreen()}
      {showOngoingCall && renderOngoingCallScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
 
  header: {


   
    marginVertical: Platform.OS === 'android' ? StatusBar.currentHeight : hp("3%"),
    
    marginHorizontal: wp('5%'),
    color: '#1A1A1A',
  },
 
  backButtonText: {
    fontSize: wp('6%'),
    color: '#333',
  },
 
  headerTitle: {
    fontSize: wp('7%'),
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('6%'),
  },
  section: {
    marginTop: hp('4%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('2%'),
  },
  imageOptions: {
    // borderColor: 'red',
    // borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp('8%'),
  },
  imageOption: {
    alignItems: 'center',
  },
  iconContainer: {
    width: wp('16%'),
    height: wp('16%'),
    backgroundColor: '#f8f8f8',
    borderRadius: wp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  optionLabel: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  formGroup: {
    gap: hp('2%'),
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: hp('7%'),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingRight: wp('12%'),
    fontSize: wp('4%'),
    color: '#333',
  },
  contactIcon: {
    position: 'absolute',
    right: wp('4%'),
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  timerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('4%'),
  },
  timerButton: {
    width: wp('42%'),
    paddingVertical: hp('2%'),
    borderRadius: wp('6%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedTimer: {
    backgroundColor: '#6B63F6',
    borderColor: '#6B63F6',
  },
  timerText: {
    fontSize: wp('3.8%'),
    color: '#666',
  },
  selectedTimerText: {
    color: '#fff',
  },
  footer: {
    padding: wp('6%'),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#6B63F6',
    paddingVertical: hp('2%'),
    borderRadius: wp('6%'),
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },callMeButton: {
    backgroundColor: '#6B63F6',
    paddingVertical: hp('2%'),
    borderRadius: wp('6%'),
    alignItems: 'center',
  },
  callMeButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callCard: {
    backgroundColor: '#fff',
    width: wp('90%'),
    borderRadius: wp('5%'),
    padding: wp('6%'),
    alignItems: 'center',
  },
  callerInfo: {
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  callerImage: {
    width: wp('25%'),
    height: wp('25%'),
    backgroundColor: '#f0f0f0',
    borderRadius: wp('12.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  callerImageText: {
    fontSize: wp('10%'),
  },
  callerName: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  callerNumber: {
    fontSize: wp('4%'),
    color: '#666',
  },
  callActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('6%'),
  },
  acceptButton: {
    backgroundColor: '#4CD964',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('6%'),
  },
  declineButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  
});
  

export default FakeCallScreen;