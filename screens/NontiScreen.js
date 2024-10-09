// NontiScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NontiScreen = () => {
  const [bookedSlot, setBookedSlot] = useState('');

  useEffect(() => {
    const getBookingData = async () => {
      try {
        const slot = await AsyncStorage.getItem('bookedSlot');
        if (slot !== null) {
          setBookedSlot(slot);
        }
      } catch (e) {
        console.log('Failed to load booking data.', e);
      }
    };

    getBookingData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification</Text>
      {bookedSlot ? (
        <Text style={styles.notification}>You have booked the slot: {bookedSlot}</Text>
      ) : (
        <Text style={styles.notification}>No booking yet.</Text>
      )}
    </View>
  );
};

export default NontiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  notification: {
    fontSize: 18,
    color: '#333',
  },
});
