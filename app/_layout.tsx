import React from 'react';
import { Redirect } from 'expo-router';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { UserLocationProvider } from "../context/UserLocationcontext";
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import AppMapview from '../app/Mapview';

export default function RootLayout() {
  return (
    <UserLocationProvider>
    <RootLayoutNav />
    </UserLocationProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Redirect href="/(tabs)" />
    </ThemeProvider>
  );
}