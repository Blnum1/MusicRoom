import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase'; // นำเข้า auth เพื่อตรวจสอบผู้ใช้งาน

const BorrowDetail = () => {
  const route = useRoute();
  const { id } = route.params; 
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดึง email ของผู้ใช้งานที่ล็อกอิน
  const currentUserEmail = auth.currentUser ? auth.currentUser.email : null;

  // ฟังก์ชันดึงข้อมูลจาก Firestore ตาม ID
  const fetchEquipment = async () => {
    try {
      const equipmentRef = doc(db, 'equipment', id);
      const equipmentSnap = await getDoc(equipmentRef);

      if (equipmentSnap.exists()) {
        setEquipment(equipmentSnap.data());
      } else {
        throw new Error('Equipment not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Equipment not found');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับยืนยันการยืม
  const handleBorrow = async () => {
    if (!currentUserEmail) {
      Alert.alert('Error', 'Please log in to borrow equipment.');
      return;
    }

    if (equipment && equipment.stock > 0) {
      try {
        // ตรวจสอบเฉพาะการยืมที่ยัง active (ไม่ได้ถูกคืน)
        const borrowHistoryRef = collection(db, 'borrowHistory');
        const q = query(borrowHistoryRef, where('equipmentId', '==', id), where('email', '==', currentUserEmail), where('status', '==', 'active'));
        const existingBorrowSnapshot = await getDocs(q);

        if (!existingBorrowSnapshot.empty) {
          Alert.alert('Error', 'You currently have this equipment on loan.');
          return;
        }

        const newStock = parseInt(equipment.stock) - 1;
        const equipmentRef = doc(db, 'equipment', id);

        // อัปเดต stock ของอุปกรณ์
        await updateDoc(equipmentRef, { stock: newStock.toString() });

        // บันทึกประวัติการยืมใน collection 'borrowHistory'
        await addDoc(collection(db, 'borrowHistory'), {
          email: currentUserEmail,
          equipmentId: id,
          equipmentName: equipment.name,
          borrowTimestamp: Timestamp.now(),
          status: 'active', // เพิ่มสถานะเพื่อช่วยให้ admin จัดการได้
        });

        Alert.alert('Success', `You have borrowed the ${equipment.name}. Remaining stock: ${newStock}`);
        setEquipment({ ...equipment, stock: newStock.toString() });
      } catch (error) {
        Alert.alert('Error', 'Failed to borrow equipment');
      }
    } else {
      Alert.alert('Out of Stock', 'This equipment is out of stock.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchEquipment();
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
