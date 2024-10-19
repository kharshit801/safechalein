import React, {useState,useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Timer from './timer';

const OngoingCallScreen = ({ 
  calls, 
  isConferenceActive, 
  onHoldCall, 
  onEndCall, 
  onStartConference, 
  onEndConference,

  onKeypad,
  onAddCall
}) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <BlurView intensity={100} tint="dark" style={styles.blurContainer}>
        <View style={styles.callerInfo}>
          {calls.map((call, index) => (
            <View key={call.id} style={styles.callerContainer}>
              {call.image ? (
                <Image source={{ uri: call.image }} style={styles.callerImage} />
              ) : (
                <View style={styles.callerImagePlaceholder}>
                  <Text style={styles.callerImagePlaceholderText}>
                    {call.name.charAt(0)}
                  </Text>
                </View>
              )}
              <Text style={styles.callerName}>{call.name}</Text>
              <Timer startTime={call.startTime} style={styles.timer} />
              <Text style={styles.callStatus}>
                {call.isOnHold ? 'On Hold' : 'Connected'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.circleButton} 
              onPress={() => {
                setIsMuted(!isMuted);
                // onMute(!isMuted);
              }}
            >
              <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Mute</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.circleButton} 
              onPress={onKeypad}
            >
              <Ionicons name="keypad" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Keypad</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.circleButton} 
              onPress={() => {
                setIsSpeakerOn(!isSpeakerOn);
                // onSpeaker(!isSpeakerOn);
              }}
            >
              <Ionicons name={isSpeakerOn ? "volume-high" : "volume-off"} size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Speaker</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            {calls.length < 5 && (
              <TouchableOpacity 
                style={styles.circleButton} 
                onPress={onAddCall}
              >
                <Ionicons name="add" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Add Call</Text>
              </TouchableOpacity>
            )}
            {!isConferenceActive && calls.length > 1 && (
              <TouchableOpacity 
                style={styles.circleButton} 
                onPress={onStartConference}
              >
                <Ionicons name="people" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Merge</Text>
              </TouchableOpacity>
            )}
            {isConferenceActive && (
              <TouchableOpacity 
                style={styles.circleButton} 
                onPress={onEndConference}
              >
                <Ionicons name="people" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Split</Text>
              </TouchableOpacity>
            )}
            {!isConferenceActive && calls.map((call) => (
              <TouchableOpacity 
                key={call.id}
                style={styles.circleButton} 
                onPress={() => onHoldCall(call.id)}
              >
                <Ionicons name={call.isOnHold ? "play" : "pause"} size={24} color="#ffffff" />
                <Text style={styles.buttonText}>{call.isOnHold ? 'Resume' : 'Hold'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.circleButton, styles.endCallButton]} 
            onPress={() => calls.forEach(call => onEndCall(call.id))}
          >
            <Ionicons name="call" size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp('4%'),
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: hp('5%'),
    width: '100%',
  },
  callerContainer: {
    alignItems: 'center',
    marginBottom: hp('3%'),
    width: '100%',
  },
  callerImage: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
    marginBottom: hp('2%'),
  },
  callerImagePlaceholder: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callerImagePlaceholderText: {
    fontSize: wp('12%'),
    color: '#ffffff',
  },
  callerName: {
    fontSize: wp('6%'),
    fontWeight: 'normal',
    color: '#ffffff',
    marginBottom: hp('1%'),
  },
  timer: {
    fontSize: wp('4%'),
    color: '#ffffff',
    marginBottom: hp('1%'),
  },
  callStatus: {
    fontSize: wp('4%'),
    color: '#ffffff',
    opacity: 0.8,
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: hp('5%'),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp('3%'),
    width: '100%',
  },
  circleButton: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('2%'),
  },
  buttonText: {
    color: '#ffffff',
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    width: wp('17%'),
    height: wp('17%'),
    borderRadius: wp('8.5%'),
  },
});

export default OngoingCallScreen;