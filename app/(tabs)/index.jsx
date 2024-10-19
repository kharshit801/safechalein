import React from 'react';
import { Button, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SOSApp = () => {
  const sendSOSCall = async () => {
    try {
      const response = await fetch('http://localhost:3000/callSOS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) // No location data sent
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const text = await response.text();
      console.log('Response text:', text);

      try {
        const result = JSON.parse(text);
        console.log('SOS call response:', result);
        Alert.alert('Success', 'SOS call initiated successfully');
      } catch (parseError) {
        console.log('Error parsing JSON:', parseError);
        Alert.alert('Error', 'Received invalid response from server');
      }
    } catch (error) {
      console.log('Error sending SOS call:', error);
      Alert.alert('Error', 'Failed to send SOS call');
    }
  };

  return (
    <SafeAreaView>
      <Button title="Send SOS" onPress={sendSOSCall} />
    </SafeAreaView>
  );
};

export default SOSApp;