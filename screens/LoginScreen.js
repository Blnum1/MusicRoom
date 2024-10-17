import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
const backgroundImage = require('../assets/loginmusic.png'); // Replace with the correct path to your image

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log('Logged in with:', user.email);

        // Save the user's email in AsyncStorage
        try {
          await AsyncStorage.setItem('userEmail', user.email);
          console.log('Email saved to AsyncStorage');
        } catch (error) {
          console.error('Error saving email:', error);
        }

        // Navigate to Main screen after successful login
        navigation.navigate('Main');
      })
      .catch((error) => {
        Alert.alert('Login failed', error.message);
      });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
          
          {/* Button to navigate to Register screen */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>
              Don't have an account? Register
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
    justifyContent: 'flex-end', // Aligns the form container to the bottom of the screen
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    width: '100%', // Makes the box take up most of the screen width
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',    
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

export default LoginScreen;
