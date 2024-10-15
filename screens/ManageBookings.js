import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  // ฟังก์ชันดึงข้อมูลการจองทั้งหมด
  const fetchBookings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ฟังก์ชันยกเลิกการจอง โดยแอดมิน
  const handleCancelBooking = async (id) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status: 'available' }); // เปลี่ยนสถานะเป็น available
      alert('Booking status updated to available');

      // อัปเดตรายการการจองหลังจากยกเลิกแล้ว
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: 'available' } : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // กรองข้อมูลเพื่อให้แสดงเฉพาะสถานะ 'booked'
  const bookedBookings = bookings.filter(booking => booking.status === 'booked');

  return (
    <View style={styles.container}>
      <FlatList
        data={bookedBookings} // ใช้ข้อมูลที่กรองแล้ว
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.roomName} - {item.bookingTime} (Status: {item.status})</Text>
            <Button title="Cancel" onPress={() => handleCancelBooking(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#f8f9fa',
    padding: 50,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ManageBookings;
