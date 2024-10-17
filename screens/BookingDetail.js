import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase'; // นำเข้า auth เพื่อใช้ตรวจสอบ email ผู้ใช้ที่ล็อกอิน

const BookingDetail = () => {
  const route = useRoute();
  const { roomId, roomName } = route.params;
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false); // ใช้เพื่อแสดงสถานะโหลด

  // ดึง email ของผู้ใช้ที่ล็อกอิน
  const currentUserEmail = auth.currentUser ? auth.currentUser.email : null;

  // ฟังก์ชันดึงข้อมูลการจองที่มีอยู่แล้วสำหรับห้องนี้
  const fetchBookedSlots = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('roomId', '==', roomId), where('status', '==', 'booked')); // ดึงเฉพาะการจองที่ active
      const querySnapshot = await getDocs(q);
      const slots = querySnapshot.docs.map(doc => doc.data().bookingTime);
      setBookedSlots(slots);
    } catch (error) {
      console.error('Error fetching booked slots: ', error);
    }
  };

  useEffect(() => {
    fetchBookedSlots();
  }, []);

  const confirmBooking = async () => {
    if (!currentUserEmail) {
      Alert.alert('Error', 'User is not logged in.');
      return;
    }

    if (selectedSlot) {
      try {
        setLoading(true);

        // Query เพื่อตรวจสอบว่าผู้ใช้นี้มีการจองอยู่แล้วหรือไม่
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('email', '==', currentUserEmail), where('status', '==', 'booked')); // ตรวจสอบว่ามีการจอง active อยู่แล้วหรือไม่
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          Alert.alert('Error', 'You have already booked a time slot. Only 1 booking is allowed per email.');
          setLoading(false);
          return;
        }

        // หากไม่มีการจองที่ active ให้ทำการสร้างเอกสารการจองใหม่
        await addDoc(collection(db, 'bookings'), {
          email: currentUserEmail,
          bookingTime: selectedSlot,
          roomId: roomId,
          roomName: roomName,
          status: 'booked', // จองสถานะใหม่
          createdAt: new Date(),
        });

        Alert.alert('Booking confirmed', `You have booked ${roomName} at ${selectedSlot}`);
        fetchBookedSlots(); // โหลดการจองใหม่
        setSelectedSlot(''); // รีเซ็ตเวลาเลือก
      } catch (error) {
        Alert.alert('Booking failed', 'There was an error booking the room');
        console.error('Error booking room:', error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Please select a time slot');
    }
  };

  const timeSlots = [
    { label: '6:00 AM - 8:00 AM', value: '6:00 AM' },
    { label: '8:00 AM - 10:00 AM', value: '8:00 AM' },
    { label: '10:00 AM - 12:00 PM', value: '10:00 AM' },
    { label: '12:00 PM - 2:00 PM', value: '12:00 PM' },
    { label: '2:00 PM - 4:00 PM', value: '2:00 PM' },
    { label: '4:00 PM - 6:00 PM', value: '4:00 PM' },
    { label: '6:00 PM - 8:00 PM', value: '6:00 PM' },
    { label: '8:00 PM - 10:00 PM', value: '8:00 PM' },
    { label: '10:00 PM - 12:00 AM', value: '10:00 PM' },
  ];

  const isSlotBooked = (slot) => bookedSlots.includes(slot);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: roomName === 'Rehearsal Room 1' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzX9J_mHk97kurmw6l-yILcXjOzuJiVHb3fQ&s' : 'https://f.ptcdn.info/112/003/000/1363186454-L-o.jpg' }} style={styles.roomImage} />
        <Text style={styles.title}>{roomName}</Text>
        <Text style={styles.detail}>Booking details for {roomName}.</Text>
        <View style={styles.timeSlotContainer}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.value}
              style={[styles.timeSlot, isSlotBooked(slot.value) ? styles.bookedSlot : (selectedSlot === slot.value ? styles.selectedSlot : styles.availableSlot)]}
              onPress={() => !isSlotBooked(slot.value) && setSelectedSlot(slot.value)}>
              <Text style={styles.timeSlotText}>{slot.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking} disabled={loading}>
          <Text style={styles.confirmText}>{loading ? 'Booking...' : 'Confirm Booking'}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  roomImage: {
    width: '100%',
    height: 210,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  detail: {
    fontSize: 14,
    marginBottom: 25,
    alignSelf: 'flex-start',
  },
  timeSlotContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    flexDirection: 'column',
  },
  timeSlot: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  availableSlot: {
    backgroundColor: '#ffffff',
  },
  bookedSlot: {
    backgroundColor: '#d3d3d3',
  },
  selectedSlot: {
    backgroundColor: '#c8e6c9',
  },
  timeSlotText: {
    color: '#000',
    fontSize: 12,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookingDetail;
