import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';

const ManageBorrowHistory = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);

  // ฟังก์ชันดึงข้อมูลประวัติการยืมจาก Firestore
  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'borrowHistory'));
        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBorrowHistory(historyData);
      } catch (error) {
        console.error('Error fetching borrow history:', error);
      }
    };

    fetchBorrowHistory();
  }, []);

  // ฟังก์ชันสำหรับลบประวัติการยืมและเพิ่ม stock กลับ
  const handleDeleteBorrow = async (id, equipmentId) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this borrow history? The equipment stock will be increased.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // ดึงข้อมูลของอุปกรณ์ที่เกี่ยวข้องกับการยืม
              const equipmentRef = doc(db, 'equipment', equipmentId);
              const equipmentSnap = await getDoc(equipmentRef);

              if (equipmentSnap.exists()) {
                const equipmentData = equipmentSnap.data();
                const newStock = parseInt(equipmentData.stock) + 1;

                // อัปเดต stock ของอุปกรณ์
                await updateDoc(equipmentRef, { stock: newStock.toString() });

                // ลบประวัติการยืมออกจาก Firestore
                await deleteDoc(doc(db, 'borrowHistory', id));
                setBorrowHistory(borrowHistory.filter((history) => history.id !== id));

                Alert.alert('Borrow history deleted and stock updated successfully');
              } else {
                Alert.alert('Error', 'Equipment not found');
              }
            } catch (error) {
              console.error('Error updating stock or deleting borrow history:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* แสดงรายการประวัติการยืม */}
      <FlatList
        data={borrowHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>Equipment: {item.equipmentName}</Text>
              <Text style={styles.itemText}>Borrower: {item.email}</Text>
              <Text style={styles.itemText}>
                Borrowed At: {new Date(item.borrowTimestamp.seconds * 1000).toLocaleString()}
              </Text>
            </View>
            <Button
              title="Delete"
              color="#e74c3c"
              onPress={() => handleDeleteBorrow(item.id, item.equipmentId)} // ส่ง equipmentId ไปให้ฟังก์ชัน
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ManageBorrowHistory;
