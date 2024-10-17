import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import { auth } from '../firebase'; // Firebase auth import
import { signOut } from 'firebase/auth'; // Import signOut function
import { useNavigation } from '@react-navigation/native'; // Navigation hook

const ProfileScreen = () => {
  const [email, setEmail] = useState(null);
  const navigation = useNavigation();

  // Component did mount: check current user info
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email); // Set the user's email
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Logout successful
        console.log('Logout successful');
        Alert.alert('Logged out', 'You have been logged out.');
        navigation.replace('Login'); // Navigate back to LoginScreen
      })
      .catch((error) => {
        // Error handling
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image URL
          style={styles.profileImage}
        />
        {email ? (
          <Text style={styles.email}>Logged in as: {email}</Text>
        ) : (
          <Text style={styles.email}>No user logged in</Text>
        )}
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    marginTop: 20, // Space from the top of the screen
    alignItems: 'center', // Center items within the card
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});
