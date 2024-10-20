import React, { useContext, useEffect, useState } from 'react';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { UserLocationContext } from '../context/UserLocationcontext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';

export default function AppMapview({ wellLitAreas, monitoredAreas }) {
  const { location, errorMsg } = useContext(UserLocationContext);
  const [routes, setRoutes] = useState([]);
  const [wellLitLocations, setWellLitLocations] = useState([]);
  const [monitoredLocations, setMonitoredLocations] = useState([]);

  const defaultRegion = {
    latitude: 26.8467,
    longitude: 80.9462,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  };

  useEffect(() => {
    const fetchSafeRoutes = async () => {
      if (!location) {
        console.log('Location not available, skipping route fetch');
        return;
      }
    
      // Set your destination coordinates (example)
      const destination = { lat: 28.6139, lng: 77.2090 }; // Replace with actual destination coordinates
      const origin = `${location.latitude},${location.longitude}`;
      const apiKey = 'AIzaSyBzXNtnt_1DmStzHrQFnuXjQurO4m6QSwI'; // Replace with your API Key
      const mode = 'driving';
      
      let waypoints = '';
      // Append waypoints based on user preferences
      if (wellLitAreas) {
        waypoints += 'waypoint1|waypoint2'; // Replace with actual well-lit area coordinates
      }
      if (monitoredAreas) {
        waypoints += 'waypoint3|waypoint4'; // Replace with actual monitored area coordinates
      }
    
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination.lat},${destination.lng}&waypoints=${waypoints}&mode=${mode}&key=${apiKey}`;
    
      try {
        console.log('Fetching directions from URL:', url);
        const response = await axios.get(url);
        console.log('API Response:', JSON.stringify(response.data, null, 2));
    
        if (response.data.status !== 'OK') {
          console.error('API returned non-OK status:', response.data.status);
          console.error('Error message:', response.data.error_message);
          return;
        }
    
        if (!response.data.routes || response.data.routes.length === 0) {
          console.error('No routes found in the API response');
          return;
        }
    
        const points = response.data.routes[0].legs[0].steps.map(step => ({
          latitude: step.start_location.lat,
          longitude: step.start_location.lng,
        }));
        setRoutes(points);
    
        // Simulated well-lit and monitored areas (replace with actual data)
        const simulatedWellLitAreas = [
          { latitude: 26.8567, longitude: 80.9562 },
          { latitude: 26.8367, longitude: 80.9362 },
        ];
        const simulatedMonitoredAreas = [
          { latitude: 26.8667, longitude: 80.9662 },
          { latitude: 26.8267, longitude: 80.9262 },
        ];
    
        setWellLitLocations(simulatedWellLitAreas);
        setMonitoredLocations(simulatedMonitoredAreas);
      } catch (error) {
        console.error('Error fetching directions:', error);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
      }
    };

    fetchSafeRoutes();
  }, [location, wellLitAreas, monitoredAreas]);

  if (!location && !errorMsg) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : defaultRegion}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
          />
        )}
        {routes.length > 0 && (
          <Polyline
            coordinates={routes}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}
        {wellLitAreas && wellLitLocations.map((area, index) => (
          <Circle
            key={`well-lit-${index}`}
            center={area}
            radius={200}
            fillColor="rgba(255, 255, 0, 0.3)"
            strokeColor="rgba(255, 255, 0, 0.5)"
          />
        ))}
        {monitoredAreas && monitoredLocations.map((area, index) => (
          <Circle
            key={`monitored-${index}`}
            center={area}
            radius={200}
            fillColor="rgba(0, 255, 0, 0.3)"
            strokeColor="rgba(0, 255, 0, 0.5)"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: wp('100%'),
    height: hp('90%'),
  },
  errorText: {
    color: 'red',
    margin: 10,
  },
});