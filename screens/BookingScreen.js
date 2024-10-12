import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BookingScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select a Room Booking Slot</Text>
      <View style={styles.roomsContainer}>
        {/* Room 1 */}
        <View style={styles.roomCard}>
          <Image 
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzX9J_mHk97kurmw6l-yILcXjOzuJiVHb3fQ&s' }} // URL of the room image
            style={styles.roomImage}
          />
          <Text style={styles.roomName}>Rehearsal Room 1</Text>
          <Text style={styles.roomDetail}>This is a spacious room perfect for music rehearsals.</Text>
          <TouchableOpacity 
            style={styles.bookButton} 
            onPress={() => navigation.navigate('BookingDetail', { roomName: 'Rehearsal Room 1' })} // Navigate to BookingDetail and pass roomName as a parameter
          >
            <Text style={styles.bookButtonText}>Select Time</Text>
          </TouchableOpacity>
        </View>

        {/* Room 2 */}
        <View style={styles.roomCard}>
          <Image 
            source={{ uri: 'https://f.ptcdn.info/112/003/000/1363186454-L-o.jpg' }} // URL of the room image
            style={styles.roomImage}
          />
          <Text style={styles.roomName}>Rehearsal Room 2</Text>
          <Text style={styles.roomDetail}>A cozy room suitable for small groups.</Text>

          <TouchableOpacity 
            style={styles.bookButton} 
            onPress={() => navigation.navigate('BookingDetail', { roomName: 'Rehearsal Room 2' })} // Navigate to BookingDetail and pass roomName as a parameter
          >
            <Text style={styles.bookButtonText}>Select Time</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roomsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  roomCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    padding: 10,
  },
  roomImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomDetail: {
    fontSize: 16,
    textAlign: 'left',
  },
  bookButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BookingScreen;
