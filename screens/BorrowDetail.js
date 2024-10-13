import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore'; // นำเข้า addDoc
import { db } from '../firebase';

const BorrowDetail = () => {
  const route = useRoute();
  const { id } = route.params; 
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(''); // เก็บ email ของผู้ใช้

  // ฟังก์ชันดึงข้อมูลจาก Firestore ตาม ID
  const fetchEquipment = async () => {
    try {
      console.log("Fetching equipment with ID:", id); 
      const equipmentRef = doc(db, 'equipment', id);
      const equipmentSnap = await getDoc(equipmentRef);

      if (equipmentSnap.exists()) {
        setEquipment(equipmentSnap.data());
        console.log("Equipment data:", equipmentSnap.data());
      } else {
        throw new Error('Equipment not found');
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      Alert.alert('Error', 'Equipment not found');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับยืนยันการยืม
  const handleBorrow = async () => {
    if (equipment && equipment.stock > 0 && email) {
      try {
        const newStock = parseInt(equipment.stock) - 1; 
        const equipmentRef = doc(db, 'equipment', id);

        // อัปเดต stock ของอุปกรณ์
        await updateDoc(equipmentRef, { 
          stock: newStock.toString(),
        });

        // บันทึกประวัติการยืมใน collection 'borrowHistory'
        await addDoc(collection(db, 'borrowHistory'), {
          email: email, // email ของผู้ยืม
          equipmentId: id, // ID ของอุปกรณ์
          equipmentName: equipment.name, // ชื่ออุปกรณ์
          borrowTimestamp: Timestamp.now(), // เวลาที่ยืม
        });

        Alert.alert('Success', `You have borrowed the ${equipment.name}. Remaining stock: ${newStock}`);
        setEquipment({ ...equipment, stock: newStock.toString() });
        setEmail(''); // รีเซ็ตช่องกรอก email หลังจากยืมเสร็จ
      } catch (error) {
        console.error('Error updating stock or saving borrow history:', error);
        Alert.alert('Error', 'Failed to borrow equipment');
      }
    } else {
      Alert.alert('Missing Information', 'Please enter your email and ensure the equipment is available.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchEquipment();
    } else {
      Alert.alert('Error', 'No equipment ID provided.');
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!equipment) {
    return <Text>Error loading equipment details.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: equipment.image }} style={styles.itemImage} />
      <Text style={styles.itemName}>{equipment.name}</Text>
      <Text style={styles.itemDetail}>{equipment.detail}</Text>
      <Text style={styles.itemStock}>Stock: {equipment.stock}</Text>

      {/* ช่องสำหรับกรอก email */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={[styles.borrowButton, equipment.stock === "0" && styles.disabledButton]} 
        onPress={handleBorrow}
        disabled={equipment.stock === "0"}
      >
        <Text style={styles.borrowText}>{parseInt(equipment.stock) > 0 ? 'Confirm Borrow' : 'Out of Stock'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  itemImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  itemStock: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  borrowButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  borrowText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default BorrowDetail;
