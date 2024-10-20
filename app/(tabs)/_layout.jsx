import React from "react";
import { Tabs } from "expo-router";
import { Animated } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabBarIcon = ({ name, color, size, focused }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        transform: [
          {
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.2],
            }),
          },
        ],
      }}
    >
      {name.startsWith("phone") ? (
        <Feather name={name} size={size} color={color} />
      ) : (
        <Ionicons name={name} size={size} color={color} />
      )}
    </Animated.View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6b63f6",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Track Me",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="location-outline" color={color} size={24} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="FakeCall"
        options={{
          title: "Fake Call",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="phone-call" color={color} size={24} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Recording"
        options={{
          headerShown: false,
          title: "Recordings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="recording-outline" color={color} size={24} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Helpline"
        options={{
          title: "Helpline",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="book-sharp" color={color} size={24} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="time-outline" color={color} size={24} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}