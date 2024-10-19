import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const helplineData = [
  { id: '1', number: '112', title: 'National helpline', icon: 'call' },
  { id: '2', number: '108', title: 'Ambulance', icon: 'medkit' },
  { id: '3', number: '102', title: 'Pregnancy Medic', icon: 'woman' },
  { id: '4', number: '101', title: 'Fire Service', icon: 'flame' },
  { id: '5', number: '100', title: 'Police', icon: 'shield' },
  { id: '6', number: '1091', title: 'Women helpline', icon: 'people' },
  { id: '7', number: '1098', title: 'Child Helpline', icon: 'child' },
  { id: '8', number: '1073', title: 'Road accident', icon: 'car' },
  { id: '9', number: '182', title: 'Railway protection', icon: 'train' },
];

const HelplineItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Ionicons name={item.icon} size={24} color="#fff" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.number}>{item.number}</Text>
      <Text style={styles.title}>{item.title}</Text>
    </View>
    <Ionicons name="call-outline" size={24} color="#000" />
  </TouchableOpacity>
);

const NationalHelpline = () => {
  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>National Numbers</Text>
      <Text style={styles.subHeader}>In case of an emergency, call an appropriate number for help.</Text>
      <FlatList
        data={helplineData}
        renderItem={({ item }) => (
          <HelplineItem
            item={item}
            onPress={() => handleCall(item.number)}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    color: '#666',
  },
});

export default NationalHelpline;