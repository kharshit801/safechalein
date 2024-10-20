import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthCheck = () => {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const keepSignedIn = await AsyncStorage.getItem('keepSignedIn');

      if (userData && keepSignedIn === 'true') {
        // User is logged in and wants to stay logged in
        router.replace('(tabs)');
      } else {
        // No user data or user doesn't want to stay logged in
        router.replace('/');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.replace('/');
    }
  };

  return null;
};

export default AuthCheck;