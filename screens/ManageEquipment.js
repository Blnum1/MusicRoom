import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';

const ManageEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [newEquipmentDetail, setNewEquipmentDetail] = useState('');
  const [newEquipmentImage, setNewEquipmentImage] = useState('');
  const [newEquipmentId, setNewEquipmentId] = useState('');
  const [newEquipmentStock, setNewEquipmentStock] = useState('');
  const [editingEquipment, setEditingEquipment] = useState(null);

  // ฟังก์ชันดึงข้อมูลอุปกรณ์จาก Firestore
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'equipment'));
        const equipmentData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEquipment(equipmentData);
      } catch (error) {
        console.error('Error fetching equipment: ', error);
      }
    };

    fetchEquipment();
  }, []);

  // ฟังก์ชันสำหรับลบอุปกรณ์
  const handleDeleteEquipment = async (equipmentId) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this equipment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'equipment', equipmentId));
              setEquipment(equipment.filter((item) => item.id !== equipmentId));
              Alert.alert('Equipment deleted successfully');
            } catch (error) {
              console.error('Error deleting equipment:', error);
            }
          }
        }
      ]
    );
  };

  // ฟังก์ชันสำหรับเพิ่มอุปกรณ์ใหม่
  const handleAddEquipment = async () => {
    if (newEquipmentName && newEquipmentDetail && newEquipmentImage && newEquipmentId && newEquipmentStock) {
      try {
        const newEquipment = {
          name: newEquipmentName,
          detail: newEquipmentDetail,
          image: newEquipmentImage,
          id: newEquipmentId,
          stock: newEquipmentStock,
        };
        const docRef = await addDoc(collection(db, 'equipment'), newEquipment);
        setEquipment([...equipment, { id: docRef.id, ...newEquipment }]);
        setNewEquipmentName('');
        setNewEquipmentDetail('');
        setNewEquipmentImage('');
        setNewEquipmentId('');
        setNewEquipmentStock('');
        Alert.alert('Equipment added successfully');
      } catch (error) {
        console.error('Error adding equipment:', error);
      }
    } else {
      Alert.alert('Please fill in all fields');
    }
  };

  // ฟังก์ชันสำหรับอัปเดตอุปกรณ์
  const handleEditEquipment = async () => {
    if (editingEquipment && newEquipmentName && newEquipmentDetail && newEquipmentImage && newEquipmentId && newEquipmentStock) {
      try {
        const equipmentRef = doc(db, 'equipment', editingEquipment.id);
        await updateDoc(equipmentRef, {
          name: newEquipmentName,
          detail: newEquipmentDetail,
          image: newEquipmentImage,
          id: newEquipmentId,
          stock: newEquipmentStock,
        });
        setEquipment(equipment.map((item) =>
          item.id === editingEquipment.id ? { ...item, name: newEquipmentName, detail: newEquipmentDetail, image: newEquipmentImage, id: newEquipmentId, stock: newEquipmentStock } : item
        ));
        setEditingEquipment(null);
        setNewEquipmentName('');
        setNewEquipmentDetail('');
        setNewEquipmentImage('');
        setNewEquipmentId('');
        setNewEquipmentStock('');
        Alert.alert('Equipment updated successfully');
      } catch (error) {
        console.error('Error updating equipment:', error);
      }
    } else {
      Alert.alert('Please fill in all fields');
    }
  };

  // ฟังก์ชันสำหรับเริ่มการแก้ไขอุปกรณ์
  const startEditing = (item) => {
    setEditingEquipment(item);
    setNewEquipmentName(item.name);
    setNewEquipmentDetail(item.detail);
    setNewEquipmentImage(item.image);
    setNewEquipmentId(item.id);
    setNewEquipmentStock(item.stock);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Equipment</Text>

      <TextInput
        placeholder="Equipment Name"
        value={newEquipmentName}
        onChangeText={setNewEquipmentName}
        style={styles.input}
      />
      <TextInput
        placeholder="Equipment Detail"
        value={newEquipmentDetail}
        onChangeText={setNewEquipmentDetail}
        style={styles.input}
      />
      <TextInput
        placeholder="Equipment Image URL"
        value={newEquipmentImage}
        onChangeText={setNewEquipmentImage}
        style={styles.input}
      />
      <TextInput
        placeholder="Equipment ID"
        value={newEquipmentId}
        onChangeText={setNewEquipmentId}
        style={styles.input}
      />
      <TextInput
        placeholder="Stock"
        value={newEquipmentStock}
        onChangeText={setNewEquipmentStock}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button
        title={editingEquipment ? "Update Equipment" : "Add Equipment"}
        onPress={editingEquipment ? handleEditEquipment : handleAddEquipment}
      />

      {/* แสดงรายการอุปกรณ์ */}
      <FlatList
        data={equipment}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.equipmentContainer}>
            <View style={styles.equipmentContent}>
              <Text style={styles.equipmentText}>Name: {item.name}</Text>
              <Text style={styles.equipmentText}>Detail: {item.detail}</Text>
              <Text style={styles.equipmentText}>ID: {item.id}</Text>
              <Text style={styles.equipmentText}>Stock: {item.stock}</Text>
            </View>
            <Button
              title="Edit"
              onPress={() => startEditing(item)}
            />
            <Button
              title="Delete"
              color="#e74c3c"
              onPress={() => handleDeleteEquipment(item.id)}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  equipmentContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentContent: {
    flex: 1,
    marginRight: 10,
  },
  equipmentText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ManageEquipment;
