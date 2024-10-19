import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const RECORDINGS_DIRECTORY = `${FileSystem.documentDirectory}SafeRecordings/`;
let recording: Audio.Recording | null = null;


    const ensureDirectoryExists = async () => {
        console.log("Ensuring recordings directory exists...");
    
  const dirInfo = await FileSystem.getInfoAsync(RECORDINGS_DIRECTORY);
  if (!dirInfo.exists) {
    
        console.log("Creating recordings directory:", RECORDINGS_DIRECTORY);
        await FileSystem.makeDirectoryAsync(RECORDINGS_DIRECTORY, { intermediates: true });
        console.log("Recordings directory created.");
    
  }
};


    export const startRecording = async (): Promise<void> => {
        console.log("Starting recording...");
    
  try {
    await ensureDirectoryExists(); 
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recording = newRecording;
  } catch (error) {
    console.error('Failed to start recording', error);
    throw error;
  }
};

export const stopRecording = async (): Promise<{ uri: string; duration: number | null }> => {
  if (!recording) {
    throw new Error('No active recording');
  }

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    if (!uri) {
      throw new Error('Failed to get recording URI');
    }

    return { uri, duration: null }; 
  } catch (error) {
    console.error('Failed to stop recording', error);
    throw error;
  }
};

export const getRecordingsFromFileSystem = async (): Promise<string[]> => {
  try {
    await ensureDirectoryExists(); 
    return await FileSystem.readDirectoryAsync(RECORDINGS_DIRECTORY);
  } catch (error) {
    console.error('Failed to read recordings directory', error);
    throw error;
  }
};

