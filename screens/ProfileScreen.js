import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase'; // นำเข้า Firebase auth
import { signOut } from 'firebase/auth'; // นำเข้า signOut function
import { useNavigation } from '@react-navigation/native'; // นำทางไปยังหน้าอื่น

const ProfileScreen = () => {
  const [email, setEmail] = useState(null);
  const navigation = useNavigation();

  // เมื่อ component โหลด ตรวจสอบข้อมูลผู้ใช้ปัจจุบัน
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email); // ตั้งค่าอีเมลของผู้ใช้
    }
  }, []);

  // ฟังก์ชันสำหรับ logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // ล็อกเอาท์สำเร็จ
        console.log('Logout successful');
        Alert.alert('Logged out', 'You have been logged out.');
        navigation.replace('Login'); // นำทางกลับไปยังหน้า LoginScreen
      })
      .catch((error) => {
        // หากเกิดข้อผิดพลาด
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {email ? (
        <Text style={styles.email}>Logged in as: {email}</Text>
      ) : (
        <Text style={styles.email}>No user logged in</Text>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    marginBottom: 40,
  },
});
