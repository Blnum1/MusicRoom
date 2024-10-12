import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { bookRoom } from '../fbRoomService'; // นำเข้าฟังก์ชัน bookRoom
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // นำเข้าไฟล์ firebase

const BookingDetail = () => {
  const route = useRoute();
  const { roomId, roomName } = route.params;
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]); // เก็บข้อมูลเวลาที่จองแล้ว
  const [currentDate, setCurrentDate] = useState(''); // เก็บวันที่ปัจจุบัน

  // ฟังก์ชันสำหรับดึงข้อมูลการจองที่มีอยู่
  const fetchBookedSlots = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('roomId', '==', roomId));
      const querySnapshot = await getDocs(q);
      const slots = querySnapshot.docs.map(doc => doc.data().bookingTime);
      setBookedSlots(slots); // เก็บช่วงเวลาที่จองแล้ว
    } catch (error) {
      console.error('Error fetching booked slots: ', error);
    }
  };

  // ฟังก์ชันสำหรับดึงวันที่ตามเวลาไทย
  const getCurrentDateInThailand = () => {
    const today = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Bangkok',
    };
    const formattedDate = new Intl.DateTimeFormat('th-TH', options).format(today);
    return formattedDate;
  };

  // เมื่อหน้าโหลดให้ดึงข้อมูลที่ต้องใช้
  useEffect(() => {
    fetchBookedSlots();
    setCurrentDate(getCurrentDateInThailand());
  }, []);

  // ฟังก์ชันสำหรับยืนยันการจอง
  const confirmBooking = async () => {
    if (selectedSlot) {
      try {
        await bookRoom(roomId, roomName, selectedSlot);
        Alert.alert('Booking confirmed', `You have booked ${roomName} at ${selectedSlot}`);
        fetchBookedSlots(); // อัปเดตช่วงเวลาที่จองหลังจากการจองสำเร็จ
      } catch (error) {
        if (error.message === 'Time slot already booked') {
          Alert.alert('Booking failed', 'This time slot has already been booked. Please choose another time.');
        } else {
          Alert.alert('Booking failed', 'There was an error booking the room');
        }
        console.error('Error booking room:', error);
      }
    } else {
      Alert.alert('Please select a time slot');
    }
  };

  // Time Slots สำหรับการเลือก
  const timeSlots = [
    { label: '9:00 AM', value: '9:00 AM' },
    { label: '10:00 AM', value: '10:00 AM' },
    { label: '11:00 AM', value: '11:00 AM' },
    { label: '12:00 PM', value: '12:00 PM' },
    { label: '1:00 PM', value: '1:00 PM' },
    { label: '2:00 PM', value: '2:00 PM' },
  ];

  // ฟังก์ชันสำหรับตรวจสอบว่าสล็อตถูกจองแล้วหรือไม่
  const isSlotBooked = (slot) => bookedSlots.includes(slot);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* แสดงรูปภาพของห้อง */}
        <Image 
          source={{ uri: roomName === 'Rehearsal Room 1' 
            ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzX9J_mHk97kurmw6l-yILcXjOzuJiVHb3fQ&s' 
            : 'https://f.ptcdn.info/112/003/000/1363186454-L-o.jpg' }} 
          style={styles.roomImage}
        />
        <Text style={styles.title}>{roomName}</Text>
        <Text style={styles.detail}>Booking details for {roomName}.</Text>

        {/* แสดงวันที่ปัจจุบัน */}
        <Text style={styles.detail}>Today's Date: {currentDate}</Text>

        {/* แสดง Time Slots ที่จองได้และที่จองแล้ว */}
        <View style={styles.timeSlotContainer}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.value}
              style={[
                styles.timeSlot,
                isSlotBooked(slot.value) ? styles.bookedSlot : styles.availableSlot
              ]}
              onPress={() => !isSlotBooked(slot.value) && setSelectedSlot(slot.value)} // เลือกเวลาถ้าไม่ถูกจอง
            >
              <Text style={styles.timeSlotText}>{slot.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ปุ่มยืนยันการจอง */}
        <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking}>
          <Text style={styles.confirmText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// CSS styles
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
    fontSize: 16,
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
    backgroundColor: '#ffffff', // สีขาวสำหรับเวลาที่ยังไม่ถูกจอง
  },
  bookedSlot: {
    backgroundColor: '#d3d3d3', // สีเทาสำหรับเวลาที่จองแล้ว
  },
  timeSlotText: {
    color: '#000',
    fontSize: 16,
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
    textAlign: 'center',
  },
});

export default BookingDetail;
