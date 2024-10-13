import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
      
      {/* ปุ่มสำหรับดูและจัดการข้อมูลการจอง */}
      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('ManageBookings')}>
        <Text style={styles.buttonText}>Manage Bookings</Text>
      </TouchableOpacity>
      
      {/* ปุ่มสำหรับดูและจัดการประวัติการยืม */}
      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('ManageBorrowHistory')}>
        <Text style={styles.buttonText}>Manage Borrow History</Text>
      </TouchableOpacity>

      {/* ปุ่มสำหรับดูและจัดการข้อมูลห้อง */}
      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('ManageRooms')}>
        <Text style={styles.buttonText}>Manage Rooms</Text>
      </TouchableOpacity>

      {/* ปุ่มสำหรับดูและจัดการอุปกรณ์ */}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  adminButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
