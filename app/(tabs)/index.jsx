import React from 'react';
import { Button, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SOSApp = () => {

  // Function to send SOS call via backend
  const sendSOSCall = async () => {
    try {
      // Send a POST request to your backend server to initiate the SOS call
      const response = await fetch('exp://172.29.44.87:8085/callSOS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})  // No location data sent
      });

      const result = await response.json();
      console.log('SOS call response:', result);
    } catch (error) {
      console.log('Error sending SOS call:', error);
    }
  };

  return (
    <SafeAreaView>
      <Button title="Send SOS" onPress={sendSOSCall} />
    </SafeAreaView>
  );
};

export default SOSApp;
