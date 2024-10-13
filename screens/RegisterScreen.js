import React, { useState } from 'react';
import { View, TextInput, Button, Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // นำเข้า Firestore
import { doc, setDoc } from 'firebase/firestore'; // ใช้ในการบันทึกข้อมูลใน Firestore

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Registered with:', user.email);

      // บันทึกข้อมูลผู้ใช้ลงใน Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: 'user', // กำหนดบทบาทเริ่มต้นเป็น 'user'
      });

      Alert.alert('Registration successful', 'You have been registered!');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Register" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.registerLink}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  registerLink: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default RegisterScreen;
