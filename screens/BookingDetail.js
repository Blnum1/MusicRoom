import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const BookingScreen = () => {
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // สร้างข้อมูล slot พร้อมกับสถานะว่าสามารถจองได้หรือไม่
  const slots = [
    { label: '9:00 AM', value: '9:00 AM', available: true },
    { label: '10:00 AM', value: '10:00 AM', available: false },
    { label: '11:00 AM', value: '11:00 AM', available: true },
    { label: '12:00 PM', value: '12:00 PM', available: false },
  ];
  
  const roomName = "Rehearsal Room 1";

  const confirmBooking = () => {
    console.log('Selected Slot:', selectedSlot);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image 
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzX9J_mHk97kurmw6l-yILcXjOzuJiVHb3fQ&s' }} 
          style={styles.roomImage}
        />
        
        <Text style={styles.title}>{roomName}</Text>
        <Text style={styles.detail}>DETAIL DETAIL DETAIL</Text>
        
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

      {/* Container สำหรับ dropdown และปุ่มยืนยัน */}
      <View style={styles.actionContainer}>
        {/* Dropdown สำหรับเลือกช่วงเวลาที่ต้องการจอง */}
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
    width: '120%',
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
    backgroundColor: '#4CAF50', // สีเขียว (จองได้)
  },
  unavailableSlot: {
    backgroundColor: '#F44336', // สีแดง (จองไม่ได้)
  },
  slotText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: 'row', // จัดเรียงในแนวนอน
    justifyContent: 'space-between', // จัดระยะห่างระหว่าง dropdown และปุ่ม
    alignItems: 'center', // จัดแนวในแนวตั้ง
    padding: 10, // เพิ่ม padding
    marginBottom: 20, // เพิ่มระยะห่างด้านล่าง
  },
  pickerContainer: {
    flex: 1, // ให้ dropdown มีความกว้างเต็มที่
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10, // ระยะห่างระหว่าง dropdown กับปุ่ม
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '30%', // ตั้งความกว้างของปุ่มให้เล็กกว่า dropdown
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

export default BookingScreen;
