import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDetail, setNewRoomDetail] = useState('');
  const [newRoomImage, setNewRoomImage] = useState('');
  const [newRoomId, setNewRoomId] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);

  // ฟังก์ชันดึงข้อมูลห้องจาก Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rooms'));
        const roomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms: ', error);
      }
    };

    fetchRooms();
  }, []);

  // ฟังก์ชันสำหรับลบห้อง
  const handleDeleteRoom = async (roomId) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this room?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'rooms', roomId));
              setRooms(rooms.filter((room) => room.id !== roomId));
              Alert.alert('Room deleted successfully');
            } catch (error) {
              console.error('Error deleting room:', error);
            }
          }
        }
      ]
    );
  };

  // ฟังก์ชันสำหรับเพิ่มห้องใหม่
  const handleAddRoom = async () => {
    if (newRoomName && newRoomDetail && newRoomImage && newRoomId) {
      try {
        const newRoom = {
          roomName: newRoomName,
          roomDetail: newRoomDetail,
          roomImage: newRoomImage,
          roomId: newRoomId,
          booked: false, // ค่าเริ่มต้นเป็น false
        };
        const docRef = await addDoc(collection(db, 'rooms'), newRoom);
        setRooms([...rooms, { id: docRef.id, ...newRoom }]);
        setNewRoomName('');
        setNewRoomDetail('');
        setNewRoomImage('');
        setNewRoomId('');
        Alert.alert('Room added successfully');
      } catch (error) {
        console.error('Error adding room:', error);
      }
    } else {
      Alert.alert('Please fill in all fields');
    }
  };

  // ฟังก์ชันสำหรับอัปเดตห้อง
  const handleEditRoom = async () => {
    if (editingRoom && newRoomName && newRoomDetail && newRoomImage && newRoomId) {
      try {
        const roomRef = doc(db, 'rooms', editingRoom.id);
        await updateDoc(roomRef, {
          roomName: newRoomName,
          roomDetail: newRoomDetail,
          roomImage: newRoomImage,
          roomId: newRoomId,
        });
        setRooms(rooms.map((room) =>
          room.id === editingRoom.id ? { ...room, roomName: newRoomName, roomDetail: newRoomDetail, roomImage: newRoomImage, roomId: newRoomId } : room
        ));
        setEditingRoom(null);
        setNewRoomName('');
        setNewRoomDetail('');
        setNewRoomImage('');
        setNewRoomId('');
        Alert.alert('Room updated successfully');
      } catch (error) {
        console.error('Error updating room:', error);
      }
    } else {
      Alert.alert('Please fill in all fields');
    }
  };

  // ฟังก์ชันสำหรับเริ่มการแก้ไขห้อง
  const startEditing = (room) => {
    setEditingRoom(room);
    setNewRoomName(room.roomName);
    setNewRoomDetail(room.roomDetail);
    setNewRoomImage(room.roomImage);
    setNewRoomId(room.roomId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Rooms</Text>

      <TextInput
        placeholder="Room Name"
        value={newRoomName}
        onChangeText={setNewRoomName}
        style={styles.input}
      />
      <TextInput
        placeholder="Room Detail"
        value={newRoomDetail}
        onChangeText={setNewRoomDetail}
        style={styles.input}
      />
      <TextInput
        placeholder="Room Image URL"
        value={newRoomImage}
        onChangeText={setNewRoomImage}
        style={styles.input}
      />
      <TextInput
        placeholder="Room ID"
        value={newRoomId}
        onChangeText={setNewRoomId}
        style={styles.input}
      />

      <Button
        title={editingRoom ? "Update Room" : "Add Room"}
        onPress={editingRoom ? handleEditRoom : handleAddRoom}
      />

      {/* แสดงรายการห้อง */}
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.roomContainer}>
            <View style={styles.roomContent}>
              <Text style={styles.roomText}>Room Name: {item.roomName}</Text>
              <Text style={styles.roomText}>Room Detail: {item.roomDetail}</Text>
              <Text style={styles.roomText}>Room ID: {item.roomId}</Text>
              <Text style={styles.roomText}>Booked: {item.booked ? "Yes" : "No"}</Text>
            </View>
            <Button
              title="Edit"
              onPress={() => startEditing(item)}
            />
            <Button
              title="Delete"
              color="#e74c3c"
              onPress={() => handleDeleteRoom(item.id)}
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
  roomContainer: {
    backgroundColor: '#f8f9fa',
    padding: 6,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomContent: {
    flex: 1,
    marginRight: 10,
  },
  roomText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ManageRooms;
