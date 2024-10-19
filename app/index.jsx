import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();
   
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Main App</Text>
      <Button 
        title="Go to Tab Screen" 
        onPress={() => router.push('/tabs')} 
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});