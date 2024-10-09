// BookingScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingScreen = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
    '8:00 PM - 10:00 PM',
  ];

  const handleBooking = (slot) => {
    setSelectedSlot(slot);
  };

  const confirmBooking = async () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot.');
      return;
    }

    // เก็บข้อมูลการจองลงใน AsyncStorage
    try {
      await AsyncStorage.setItem('bookedSlot', selectedSlot);
      Alert.alert('Success', `You have booked the slot: ${selectedSlot}`);
      setSelectedSlot(null); // Reset the selected slot
    } catch (e) {
      console.log('Failed to save the booking.', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Room Booking Slot</Text>
      {slots.map((slot) => (
        <TouchableOpacity
          key={slot}
          style={[styles.slotButton, selectedSlot === slot && styles.selectedSlot]}
          onPress={() => handleBooking(slot)}
        >
          <Text style={styles.slotText}>{slot}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking}>
        <Text style={styles.confirmText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slotButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#3498db',
    borderRadius: 4,
    marginVertical: 8,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#2980b9',
  },
  slotText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#2ecc71',
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default BookingScreen;
