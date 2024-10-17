import React, { useState } from 'react';
import { View, TextInput, Button, Alert, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore'; // Firestore for saving data

const backgroundImage = require('../assets/loginmusic.png'); // Replace with the correct path to your image

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password

  const handleRegister = async () => {
    // Validate if passwords match
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match. Please try again.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Registered with:', user.email);

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: 'user', // Default role as 'user'
      });

      Alert.alert('Registration successful', 'You have been registered!');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Register" onPress={handleRegister} />

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerLink}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    width: '100%', // Makes the box take up most of the screen width
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    borderRadius: 10,
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 50, // Adds space from the bottom of the screen
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  registerLink: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default RegisterScreen;
