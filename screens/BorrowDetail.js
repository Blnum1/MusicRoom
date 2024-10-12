import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Use this to get route parameters

const BorrowDetail = () => {
  const route = useRoute();
  const { item } = route.params; // Get item data from route parameters

  const handleBorrow = () => {
    Alert.alert('Success', `You have borrowed the ${item.name}.`);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetail}>{item.detail}</Text>

      <TouchableOpacity style={styles.borrowButton} onPress={handleBorrow}>
        <Text style={styles.borrowText}>Confirm Borrow</Text>
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
  borrowButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  borrowText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default BorrowDetail;
