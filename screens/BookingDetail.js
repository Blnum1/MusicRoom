import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useRoute } from '@react-navigation/native'; // Use this to get room name passed from BookingScreen

const BookingDetail = () => {
  const route = useRoute();
  const { roomName } = route.params; // Get the room name passed from the BookingScreen
  const [selectedSlot, setSelectedSlot] = useState('');

  // Available slots (can be dynamic based on the room)
  const slots = [
    { label: '9:00 AM', value: '9:00 AM', available: true },
    { label: '10:00 AM', value: '10:00 AM', available: false },
    { label: '11:00 AM', value: '11:00 AM', available: true },
    { label: '12:00 PM', value: '12:00 PM', available: false },
  ];

  const confirmBooking = () => {
    if (selectedSlot) {
      console.log(`Booked ${roomName} at ${selectedSlot}`);
    } else {
      console.log('Please select a time slot');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Dynamic room image based on the room */}
        <Image 
          source={{ uri: roomName === 'Rehearsal Room 1' 
            ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzX9J_mHk97kurmw6l-yILcXjOzuJiVHb3fQ&s' 
            : 'https://f.ptcdn.info/112/003/000/1363186454-L-o.jpg' }} 
          style={styles.roomImage}
        />
        
        <Text style={styles.title}>{roomName}</Text>
        <Text style={styles.detail}>Booking details for {roomName}.</Text>
        
        <Text style={styles.subtitle}>Time Slots Availability:</Text>
        <View style={styles.slotContainer}>
          {slots.map((slot) => (
            <View
              key={slot.value}
              style={[
                styles.slotButton, 
                slot.available ? styles.availableSlot : styles.unavailableSlot,
              ]}
            >
              <Text style={styles.slotText}>{slot.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.actionContainer}>
        {/* Dropdown for selecting a time slot */}
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedSlot(value)}
            items={slots}
            placeholder={{ label: 'Select a slot', value: null }}
            style={pickerSelectStyles}
          />
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking}>
          <Text style={styles.confirmText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  detail: {
    fontSize: 16,
    marginBottom: 25,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  roomImage: {
    width: '100%',
    height: 210,
    borderRadius: 8,
    marginBottom: 8,
  },
  slotContainer: {
    width: '50%',
    marginBottom: 10,
  },
  slotButton: {
    padding: 8,
    borderRadius: 3,
    marginVertical: 1,
  },
  availableSlot: {
    backgroundColor: '#4CAF50',
  },
  unavailableSlot: {
    backgroundColor: '#F44336',
  },
  slotText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '30%',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
};

export default BookingDetail;
