import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRecordings, Recording as RecordingType } from '../utils/databaseUtils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const History: React.FC = () => {
  const [recordings, setRecordings] = useState<RecordingType[]>([]);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const loadedRecordings = await getRecordings();
      setRecordings(loadedRecordings.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Failed to load recordings', error);
      Alert.alert('Error', 'Failed to load recordings');
    }
  };

  const handleRecordingPress = (item: RecordingType) => {
    Alert.alert('Recording Details', `ID: ${item.id}\nTimestamp: ${new Date(item.timestamp).toLocaleString()}\nDuration: ${item.duration || 'Unknown'}\nURI: ${item.uri}`);
  };

  const renderRecordingItem = ({ item }: { item: RecordingType }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleRecordingPress(item)}>
      <Ionicons name="mic" size={wp('6%')} color="black" />
      <View style={styles.itemDetails}>
        <Text style={styles.itemType}>Audio Recording</Text>
        <Text style={styles.itemTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      <Ionicons name="chevron-forward" size={wp('6%')} color="black" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recording History</Text>
      {/* <FlatList
        data={recordings}
        renderItem={renderRecordingItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No recordings found</Text>}
      /> */}
      <TouchableOpacity style={styles.historyButtonContentContainer}>
      <View style={styles.historyButtonContent}>
            <View style={styles.historyTextContainer}>
            <Ionicons name="mic" size={wp('6%')} color="black" />

              <Text style={styles.historyText}>Recording 1</Text>

            </View>
            <Ionicons name="play" size={wp('6%')} color="black" />
          </View>
          </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('4%'),
    backgroundColor: '#fff',
  },
  title: {
    marginVertical: Platform.OS === 'android' ? StatusBar.currentHeight : hp('3%') ,
    fontSize: wp('7%'),
    fontWeight: '700',
    color: '#1A1A1A',
    marginHorizontal: wp('5%'),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: wp('4%'),
  },
  itemType: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  itemTimestamp: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: hp('4%'),
    fontSize: wp('4%'),
    color: '#666',
  },

  historyButtonContentContainer: {
    borderRadius: wp('2%'),
    marginHorizontal: wp('5%'),
    shadowColor: '#000',
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },


  historyButtonContent: {
    
    padding: wp('4%'),
    justifyContent: 'space-between',
    borderRadius: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
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
});

export default History;
