import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform,StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { startRecording, stopRecording } from '../utils/recordingUtils';
import { saveRecording, getRecordings, Recording as RecordingType } from '../utils/databaseUtils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type RootStackParamList = {
  Recording: undefined;
  History: undefined;
};

type RecordingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Recording'>;

const Recording: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingsCount, setRecordingsCount] = useState(0);
  const navigation = useNavigation<RecordingScreenNavigationProp>();
  useEffect(() => {
    loadRecordingsCount();
  }, []);

  const loadRecordingsCount = async () => {
    try {
      const recordings = await getRecordings();
      setRecordingsCount(recordings.length);
    } catch (error) {
      console.error('Error loading recordings count:', error);
      Alert.alert('Error', 'Failed to load recordings count');
    }
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        const recordingData = await stopRecording();
        setIsRecording(false);
        const newRecording: RecordingType = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          duration: recordingData.duration,
          uri: recordingData.uri,
        };
        await saveRecording(newRecording);
        await loadRecordingsCount();
      } else {
        await startRecording();
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      Alert.alert('Error', isRecording ? 'Failed to stop recording' : 'Failed to start recording');
      setIsRecording(false);
    }
  };

  const navigateToHistory = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.container}>
     
      <View style={styles.content}>
        <Text style={styles.header}>Anonymous Recording</Text>
        <Text style={styles.contentSubtitle}>
          Anonymously record audio and location without notifying others.
        </Text>
        
        <TouchableOpacity style={styles.historyButton} onPress={navigateToHistory}>
          <View style={styles.historyButtonContent}>
            <Ionicons name="mic" size={wp('6%')} color="black" />
            <View style={styles.historyTextContainer}>
              <Text style={styles.historyText}>Recordings</Text>
              <Text style={styles.historySubtext}>{recordingsCount} saved</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={wp('6%')} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.recordingButton, isRecording && styles.stopRecordingButton]}
          onPress={toggleRecording}
        >
          <Ionicons name={isRecording ? "stop" : "mic"} size={wp('6%')} color="white" />
          <Text style={styles.recordingButtonText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {

    marginVertical: Platform.OS === 'android' ? StatusBar.currentHeight : hp("3%"),
    marginHorizontal: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    fontSize: wp('7%'),
    fontWeight: '700',
    color: '#1A1A1A',
  },
  logo: {
    borderWidth: 1,
    borderColor: "blue",
    width: wp('50%'),
    height: hp('15%'),
  },
  content: {
  
    flex: 1,
  },

  contentSubtitle: {
    fontSize: wp('4%'),
    color: '#666',
    marginBottom: hp('3%'),
    marginHorizontal: wp('5%'),
  },
  historyButton: {
    marginHorizontal: wp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    marginBottom: hp('3%'),
  },
  historyButtonContent: {

    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTextContainer: {
    marginLeft: wp('4%'),
  },
  historyText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  historySubtext: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  recordingButton: {
    marginHorizontal: wp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B63F6',
    padding: wp('4%'),
    borderRadius: wp('6%'),
    marginTop: 'auto',
  },
  stopRecordingButton: {
    backgroundColor: '#4CAF50',
  },
  recordingButtonText: {
    color: 'white',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
});

export default Recording;
