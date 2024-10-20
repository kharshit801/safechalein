import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Linking, SafeAreaView ,Platform,StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const helplineData = [
  { id: '1', number: '112', title: 'National helpline', icon: 'call' },
  { id: '2', number: '108', title: 'Ambulance', icon: 'medkit' },
  { id: '3', number: '102', title: 'Pregnancy Medic', icon: 'woman' },
  { id: '4', number: '101', title: 'Fire Service', icon: 'flame' },
  { id: '5', number: '100', title: 'Police', icon: 'shield' },
  { id: '6', number: '1091', title: 'Women helpline', icon: 'people' },
  { id: '7', number: '1098', title: 'Child Helpline', icon: 'happy' },
  { id: '8', number: '1073', title: 'Road accident', icon: 'car' },
  { id: '9', number: '182', title: 'Railway protection', icon: 'train' },
];

const HelplineItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Ionicons name={item.icon} size={wp('6%')} color="#fff" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.number}>{item.number}</Text>
      <Text style={styles.title}>{item.title}</Text>
    </View>
    <Ionicons name="call-outline" size={wp('5%')} color="#A0A0A0" />
  </TouchableOpacity>
);

const NationalHelpline = () => {
  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Emergency Contacts</Text>
      <FlatList
        data={helplineData}
        renderItem={({ item }) => (
          <HelplineItem
            item={item}
            onPress={() => handleCall(item.number)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    marginVertical: Platform.OS === 'android' ? StatusBar.currentHeight : hp("3%"),
    fontSize: wp('7%'),
    fontWeight: '700',
    color: '#1A1A1A',
    marginHorizontal: wp('5%'),
  },
  listContainer: {
    paddingHorizontal: wp('5%'),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: '#6B63F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  textContainer: {
    flex: 1,
  },
  number: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: hp('0.5%'),
  },
  title: {
    fontSize: wp('3.5%'),
    color: '#6C757D',
  },
});

export default NationalHelpline;