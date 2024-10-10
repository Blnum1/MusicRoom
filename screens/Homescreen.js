// Homescreen.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import BookingScreen from './BookingScreen';
import BorrowScreen from './BorrowScreen';

const Stack = createStackNavigator();

const Homescreen = ({ navigation }) => {
  const rooms = [
    {
      name: "Rehearsal Room 1",
      detail: "A spacious room perfect for music rehearsals.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzX9J_mHk97kurmw6l-yILcXjOzuJiVHb3fQ&s",
    },
    {
      name: "Rehearsal Room 2",
      detail: "A cozy room suitable for small groups.",
      image: "https://f.ptcdn.info/112/003/000/1363186454-L-o.jpg",
    },
  ];

  return (
    <View style={styles.container}>
      {/* จัดเรียงปุ่มในแนวนอน */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Booking')}
        >
          <Text style={styles.buttonText}>Go to Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Borrow')}
        >
          <Text style={styles.buttonText}>Go to Borrow</Text>
        </TouchableOpacity>
      </View>

      {/* กล่องข้อมูลห้อง */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomsContainer}>
        {rooms.map((room, index) => (
          <View style={styles.roomCard} key={index}>
            <Image source={{ uri: room.image }} style={styles.roomImage} />
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomDetail}>{room.detail}</Text>
            <TouchableOpacity
              style={styles.bookingButton}
              onPress={() => navigation.navigate('Booking')}
            >
              <Text style={styles.bookingButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f8f9fa', // เปลี่ยนสีพื้นหลัง
    paddingTop: 20,
  },
  roomsContainer: {
    flexDirection: 'row', // จัดเรียงห้องในแนวนอน
    alignItems: 'center',
    paddingVertical: 10,
  },
  roomCard: {
    width: 200, // กำหนดความกว้างของกล่อง
    backgroundColor: '#fff', // สีพื้นหลังของกล่อง
    borderRadius: 8, // มุมโค้งมน
    elevation: 2, // เงาของกล่อง
    padding: 15, // Padding ภายในกล่อง
    marginHorizontal: 10, // ระยะห่างระหว่างกล่อง
    alignItems: 'center', // จัดกลางเนื้อหาภายในกล่อง
  },
  roomImage: {
    width: '100%', // กำหนดความกว้างของรูป
    height: 100, // ความสูงของรูป
    borderRadius: 8, // มุมโค้งมนของรูป
    marginBottom: 10, // ระยะห่างด้านล่างของรูป
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
    backgroundColor: '#28a745', // สีพื้นหลังของปุ่ม
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  bookingButtonText: {
    color: '#ffffff', // สีข้อความในปุ่ม
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 30,
    flex: 1,
    marginHorizontal: 2, // สามารถปรับให้มากขึ้นหรือน้อยลงได้
    borderRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff', // สีข้อความในปุ่ม
    fontSize: 16,
    textAlign: 'center',
  },
});

// สร้าง Stack Navigator สำหรับหน้า Booking และ Borrow
const HomescreenStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Homescreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Borrow" component={BorrowScreen} />
    </Stack.Navigator>
  );
};

export default HomescreenStack;
