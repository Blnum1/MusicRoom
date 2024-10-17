import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore'; // นำเข้าฟังก์ชัน Firestore
import { db } from '../firebase'; // นำเข้าไฟล์ firebase ของคุณ

const BookingScreen = () => {
  const navigation = useNavigation();
  const [rooms, setRooms] = useState([]); // สถานะสำหรับเก็บข้อมูลห้อง

  // ฟังก์ชันสำหรับดึงข้อมูลห้องจาก Firestore
  const fetchRoomsFromDatabase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      const roomsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsData); // เก็บข้อมูลห้องใน state
    } catch (error) {
      console.error('Error fetching rooms: ', error);
    }
  };

  // เรียกใช้งานฟังก์ชันเมื่อโหลดหน้า BookingScreen
  useEffect(() => {
    fetchRoomsFromDatabase();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select a Room Booking Slot</Text>
      <View style={styles.roomsContainer}>
        {rooms.map((room) => (
          <View key={room.id} style={styles.roomCard}>
            <Image source={{ uri: room.roomImage }} style={styles.roomImage} />
            <Text style={styles.roomName}>{room.roomName}</Text>
            <Text style={styles.roomDetail}>{room.roomDetail}</Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => navigation.navigate('BookingDetail', { roomId: room.id, roomName: room.roomName })}
            >
              <Text style={styles.bookButtonText}>Select Time</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex',
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
  roomsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  roomCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    padding: 10,
  },
  roomImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomDetail: {
    fontSize: 12,
    textAlign: 'left',
  },
  bookButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BookingScreen;
