// BorrowScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

// ตัวอย่างข้อมูลอุปกรณ์
const equipmentData = [
  {
    id: '1',
    name: 'Microphone',
    detail: 'High-quality microphone for recording.',
    image: 'https://example.com/microphone.png', // เปลี่ยนเป็น URL ของรูป
  },
  {
    id: '2',
    name: 'Guitar',
    detail: 'Acoustic guitar for music rehearsals.',
    image: 'https://example.com/guitar.png', // เปลี่ยนเป็น URL ของรูป
  },
  {
    id: '3',
    name: 'Keyboard',
    detail: 'Electric keyboard for performances.',
    image: 'https://example.com/keyboard.png', // เปลี่ยนเป็น URL ของรูป
  },
  // เพิ่มอุปกรณ์อื่นๆ ตามต้องการ
];

const BorrowScreen = () => {
  const handleBorrow = (item) => {
    Alert.alert('Success', `You have borrowed the ${item.name}.`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetail}>{item.detail}</Text>
        <TouchableOpacity
          style={styles.borrowButton}
          onPress={() => handleBorrow(item)}
        >
          <Text style={styles.borrowText}>Borrow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={equipmentData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  borrowButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  borrowText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BorrowScreen;
