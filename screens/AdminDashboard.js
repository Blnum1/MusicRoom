import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.role === 'admin') {
              setIsAdmin(true);
            } else {
              navigation.navigate('Home');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      
      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('ManageBookings')}>
        <Text style={styles.buttonText}>Manage Bookings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('ManageBorrowHistory')}>
        <Text style={styles.buttonText}>Manage Borrow History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('ManageRooms')}>
        <Text style={styles.buttonText}>Manage Rooms</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('ManageEquipment')}>
        <Text style={styles.buttonText}>Manage Equipment</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa', // เปลี่ยนพื้นหลังให้เป็นสีอ่อน
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30, // เพิ่มระยะห่างจากหัวข้อและปุ่ม
  },
  adminButton: {
    backgroundColor: '#3498db', // ปุ่มสีฟ้า
    paddingVertical: 15, // เพิ่มขนาดของปุ่ม
    paddingHorizontal: 24,
    borderRadius: 8, // ทำให้มุมของปุ่มโค้งมนขึ้น
    marginBottom: 15,
    alignItems: 'center',
    width: '80%', // ทำให้ปุ่มกว้างขึ้น
    elevation: 5, // เพิ่มเงาให้ปุ่มเพื่อความนูน
    shadowColor: '#000', 
    shadowOffset: { width: 2, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
  },
  buttonText: {
    color: '#fff', // ข้อความสีขาว
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase', // ทำให้ข้อความเป็นตัวพิมพ์ใหญ่ทั้งหมด
    letterSpacing: 1, // เพิ่มการเว้นระยะระหว่างตัวอักษร
  },
});

export default AdminDashboard;
