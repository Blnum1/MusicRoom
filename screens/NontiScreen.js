import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase configuration
import AsyncStorage from '@react-native-async-storage/async-storage';

const NontiScreen = () => {
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        // ดึง email ของผู้ใช้ที่ล็อกอินจาก AsyncStorage
        const userEmail = await AsyncStorage.getItem('userEmail');
        
        if (userEmail) {
          setEmail(userEmail);

          // ดึงประวัติการยืม ที่ตรงกับอีเมลของผู้ใช้
          const borrowQuery = query(
            collection(db, 'borrowHistory'),
            where('email', '==', userEmail)
          );
          const borrowSnapshot = await getDocs(borrowQuery);
          const borrowData = borrowSnapshot.docs.map((doc) => doc.data());
          setBorrowingHistory(borrowData);

          // ดึงประวัติการจอง ที่ตรงกับอีเมลของผู้ใช้
          const bookingQuery = query(
            collection(db, 'bookings'),
            where('email', '==', userEmail)
          );
          const bookingSnapshot = await getDocs(bookingQuery);
          const bookingData = bookingSnapshot.docs.map((doc) => doc.data());
          setBookingHistory(bookingData);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>การแจ้งเตือน</Text>

      <Text style={styles.sectionTitle}>ประวัติการยืม</Text>
      {borrowingHistory.length > 0 ? (
        borrowingHistory.map((borrow, index) => (
          <View key={index} style={styles.historyItem}>
            <Text>อุปกรณ์: {borrow.equipmentName}</Text>
            <Text>วันที่ยืม: {new Date(borrow.borrowTimestamp.seconds * 1000).toLocaleString()}</Text>
            <Text>ผู้ยืม: {borrow.email}</Text>
          </View>
        ))
      ) : (
        <Text>ไม่มีประวัติการยืม</Text>
      )}

      <Text style={styles.sectionTitle}>ประวัติการจอง</Text>
      {bookingHistory.length > 0 ? (
        bookingHistory.map((booking, index) => (
          <View key={index} style={styles.historyItem}>
            <Text>ห้อง: {booking.roomName}</Text>
            <Text>เวลาจอง: {booking.bookingTime}</Text>
            <Text>สถานะ: {booking.status}</Text>
            <Text>ผู้จอง: {booking.email}</Text>
          </View>
        ))
      ) : (
        <Text>ไม่มีประวัติการจอง</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  historyItem: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default NontiScreen;
