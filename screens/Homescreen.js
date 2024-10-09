// Homescreen.js
import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import BookingScreen from './BookingScreen';
import BorrowScreen from './BorrowScreen';

const Stack = createStackNavigator();

const Homescreen = ({ navigation }) => {
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
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
button: {
  backgroundColor: '#007bff', // สีพื้นหลังของปุ่ม
  paddingVertical: 30,
  paddingHorizontal: 50,
  borderRadius: 5,
  elevation: 3, // เพิ่มเงาให้ปุ่ม
  marginHorizontal: 5, // ระยะห่างระหว่างปุ่ม
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
