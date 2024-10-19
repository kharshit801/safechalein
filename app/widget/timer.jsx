import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Timer = ({ startTime = new Date(), style }) => {
  const [duration, setDuration] = useState('00:00');

  useEffect(() => {
    let intervalId;
    
    const updateDuration = () => {
      const now = new Date();
      const diff = now - startTime;
      
      // Calculate minutes and seconds
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      // Format the time string
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      
      setDuration(`${formattedMinutes}:${formattedSeconds}`);
    };

    // Update immediately and then every second
    updateDuration();
    intervalId = setInterval(updateDuration, 1000);

    // Cleanup interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [startTime]);

  return <Text style={[styles.timerText, style]}>{duration}</Text>;
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: wp('4%'),
    color: '#ffffff',
    opacity: 0.8,
  },
});

export default Timer;