import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, Animated, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; // นำเข้าฟังก์ชัน Firestore
import { db, auth } from '../firebase'; // นำเข้า Firebase
import AsyncStorage from '@react-native-async-storage/async-storage'; // สำหรับดึง email ของผู้ใช้
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

const Homescreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]); // เก็บข้อมูลห้องจาก Firestore
  const [equipmentData, setEquipmentData] = useState([]); // เก็บข้อมูลอุปกรณ์จาก Firestore
  const [isAdmin, setIsAdmin] = useState(false); // เก็บสถานะว่าเป็น admin หรือไม่
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

  // ตรวจสอบบทบาทผู้ใช้ (Admin หรือไม่)
  const checkAdminRole = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // ดึงข้อมูลผู้ใช้จาก Firestore โดยใช้ uid
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.role === 'admin') {
            setIsAdmin(true); // ถ้าเป็น admin ให้แสดงปุ่ม
          }
        }
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  // เรียกใช้เมื่อหน้าโหลด
  useEffect(() => {
    fetchRoomsFromDatabase();
    fetchEquipmentData();
    checkAdminRole(); // ตรวจสอบบทบาทผู้ใช้
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
{/* ปุ่มสำหรับแอดมิน */}
{isAdmin && (
         <View style={styles.adminContainer}>
         <TouchableOpacity
           style={styles.adminButton} 
           onPress={() => navigation.navigate('AdminDashboard')}
         >
           <Text style={styles.adminButtonText}>Admin Dashboard</Text>
         </TouchableOpacity>
       </View>
       
        )}
        {/* ปุ่มไปยังหน้า Booking และ Borrow */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Booking')}>
            <Text style={styles.buttonStart}>Booking Rooms</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Borrow')}>
            <Text style={styles.buttonStart}>Borrow</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chatbot')}>
            
            <Text style={styles.buttonText}>Chatbot</Text>
            <Text style={styles.buttonDeatail}>Chat can help!</Text>
            
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChartScreen')}>
            <Text style={styles.buttonText}>Chart</Text>
            <Text style={styles.buttonDeatail}>All statistics!</Text>
          </TouchableOpacity>
        </View>
        
        

        {/* Section สำหรับแสดงห้อง */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Booking Rooms</Text>
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
          <Text style={styles.sectionHeaderText}>Borrow Equipment</Text>
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
          <Ionicons name="logo-android" size={24} color="#fff" />
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
    bottom: 40,
    right: 20,
    backgroundColor: '#28a745',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  roomsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    
  },
  roomCard: {
    width: 300,
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#FAFFFF',
  },
  equipCard: {
    width: 200,
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#FAFFFF',
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#FAFFFF',
  },
  roomImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomDetail: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#FAFFFF',
    paddingVertical: 20,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 5,
    elevation: 3,
    borderWidth: 2, 
    borderColor: '#05675E', 
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonStart: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonDeatail: {
    fontSize: 10,
    textAlign: 'center',
  },
  adminContainer: {
    width: '100%', // ให้ครอบคลุมความกว้างของหน้าจอ
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10, // เพิ่มระยะห่างแนวตั้ง
  },
  adminButton: {
    backgroundColor: '#05675E',
    paddingVertical: 15,
    paddingHorizontal: 50, // ขนาด padding แนวนอน
    borderRadius: 5,
    width: '95%', // ปรับความกว้างของปุ่มเป็น 80% ของหน้าจอ
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Homescreen;
