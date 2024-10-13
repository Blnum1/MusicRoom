import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, Animated } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import BookingScreen from './BookingScreen';
import BorrowScreen from './BorrowScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import Chatbot from './Chatbot';
import { collection, getDocs } from 'firebase/firestore'; // นำเข้าฟังก์ชัน Firestore
import { db } from '../firebase'; // นำเข้าไฟล์ firebase ของคุณ

const Stack = createStackNavigator();

const Homescreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]); // เก็บข้อมูลห้องจาก Firestore
  const [equipmentData, setEquipmentData] = useState([]); // เก็บข้อมูลอุปกรณ์จาก Firestore
  const scrollY = new Animated.Value(0);

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

  // ฟังก์ชันสำหรับดึงข้อมูลอุปกรณ์จาก Firestore
  const fetchEquipmentData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'equipment'));
      const equipmentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEquipmentData(equipmentList); // เก็บข้อมูลอุปกรณ์ใน state
    } catch (error) {
      console.error('Error fetching equipment data: ', error);
    }
  };

  // เรียกใช้เมื่อหน้าโหลด
  useEffect(() => {
    fetchRoomsFromDatabase();
    fetchEquipmentData();
  }, []);

  const fabPosition = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [20, 120],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.verticalScrollView}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >

        {/* ปุ่มไปยังหน้า Booking และ Borrow */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Booking')}>
            <Text style={styles.buttonText}>Go to Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Borrow')}>
            <Text style={styles.buttonText}>Go to Borrow</Text>
          </TouchableOpacity>
        </View>

        <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chatbot')}>
            <Text style={styles.buttonText}>Go to Chatbot</Text>
          </TouchableOpacity>
        </View>

        {/* Section สำหรับแสดงห้อง */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Music Rooms</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomsContainer}>
          {rooms.map((room, index) => (
            <TouchableOpacity style={styles.roomCard} key={index} onPress={() => navigation.navigate('Booking')}>
              <Image source={{ uri: room.roomImage }} style={styles.roomImage} />
              <Text style={styles.roomName}>{room.roomName}</Text>
              <Text style={styles.roomDetail}>{room.roomDetail}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section สำหรับแสดงอุปกรณ์ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Equipment</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomsContainer}>
          {equipmentData.map((equipment, index) => (
            <TouchableOpacity style={styles.equipCard} key={index} onPress={() => navigation.navigate('Borrow')}>
              <Image source={{ uri: equipment.image }} style={styles.roomImage} />
              <Text style={styles.roomName}>{equipment.name}</Text>
              <Text style={styles.roomDetail}>{equipment.detail}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </Animated.ScrollView>

      <Animated.View style={[styles.fab, { transform: [{ translateY: fabPosition }] }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbot')}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 40, // ปรับค่าตรงนี้ให้อยู่สูงขึ้นจากเดิม
    right: 20,
    backgroundColor: '#28a745',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  
  imageStyle: {
    width: 380, // กำหนดความกว้างของรูปภาพ
    height: 200, // กำหนดความสูงของรูปภาพ
    borderRadius: 8, // มุมโค้งมน
    resizeMode: 'cover', // ปรับให้รูปภาพแสดงแบบเต็มพื้นที่กล่อง
  },
  
  roomsContainer: {
    flexDirection: 'row', // จัดเรียงห้องในแนวนอน
    alignItems: 'center',
    paddingVertical: 10,
    
  },
  roomCard: {
    width: 300, // กำหนดความกว้างของกล่อง
    height: 225,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'flex-start', // จัดกลางเนื้อหาภายในกล่อง
    borderWidth: 2, // ความหนาของกรอบ
    borderColor: '#ccc',
  },
  equipCard: {
    width: 200, // กำหนดความกว้างของกล่อง
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'center', // จัดกลางเนื้อหาภายในกล่อง
  },
  roomImage: {
    width: '100%', // ปรับขนาดรูปภาพให้เต็มความกว้างของกล่อง
    height: 120, // ตั้งค่าความสูงคงที่ของรูปภาพ
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover', // ปรับการแสดงผลของรูปภาพให้คงอัตราส่วน
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomDetail: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  bookingButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  bookingButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  borrowButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 30,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 5,
    elevation: 3,
    borderWidth: 2, // ความหนาของกรอบ
    borderColor: '#ccc',
  },
  buttonText: {
    
    fontSize: 16,
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft : 50,
    width: '100%',
    alignItems: 'flex-start',
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Homescreen;
