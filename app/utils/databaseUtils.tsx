import * as FileSystem from 'expo-file-system';
import { getRecordingsFromFileSystem } from './recordingUtils';

export interface Recording {
  id: string;
  timestamp: number;
  duration: number | null;
  uri: string;
}

const RECORDINGS_METADATA_FILE = FileSystem.documentDirectory + 'recordings_metadata.json';

const saveMetadata = async (recordings: Recording[]): Promise<void> => {
  
    try {
        console.log("Saving metadata to file:", recordings);
        await FileSystem.writeAsStringAsync(RECORDINGS_METADATA_FILE, JSON.stringify(recordings));
        console.log("Metadata saved successfully.");
    } catch (error) {
        console.error("Error saving metadata:", error);
    }
    
};

const loadMetadata = async (): Promise<Recording[]> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(RECORDINGS_METADATA_FILE);
    
    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(RECORDINGS_METADATA_FILE, JSON.stringify([]));
      return [];
    }

    const content = await FileSystem.readAsStringAsync(RECORDINGS_METADATA_FILE);
    return JSON.parse(content);
  } catch (error) {
    console.warn('Failed to load metadata, returning empty array', error);
    return [];
  }
};

export const saveRecording = async (recording: Recording): Promise<void> => {
  try {
    const recordings = await loadMetadata();
    recordings.push(recording);
    await saveMetadata(recordings);
  } catch (error) {
    console.error('Error saving recording:', error);
    throw error;
  }
};

export const getRecordings = async (): Promise<Recording[]> => {
  try {
    const metadata = await loadMetadata();
    const fileUris = await getRecordingsFromFileSystem();
    
    // Filter out recordings that don't have a corresponding file
    return metadata.filter(recording => fileUris.includes(recording.uri));
  } catch (error) {
    console.error('Error getting recordings:', error);
    throw error;
  }
};

export const deleteRecording = async (id: string): Promise<void> => {
  try {
    const recordings = await loadMetadata();
    const recordingToDelete = recordings.find(r => r.id === id);
    
    if (recordingToDelete) {
      await FileSystem.deleteAsync(recordingToDelete.uri, { idempotent: true });
    }
    
    const updatedRecordings = recordings.filter(recording => recording.id !== id);
    await saveMetadata(updatedRecordings);
  } catch (error) {
    console.error('Error deleting recording:', error);
    throw error;
  }
};