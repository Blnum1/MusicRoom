import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import StackNavigator from './StackNavigator'; // นำเข้า StackNavigator
import { auth } from './firebase'; // นำเข้า Firebase auth
import LoginScreen from './screens/LoginScreen'; // นำเข้า LoginScreen
import { NavigationContainer } from '@react-navigation/native'; // นำเข้า NavigationContainer

const App = () => {
  const [loggedIn, setLoggedIn] = useState(null); // ใช้ state เพื่อเก็บสถานะการล็อกอิน

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User logged in:", user.email);
        setLoggedIn(true);
      } else {
        console.log("No user logged in");
        setLoggedIn(false);
      }
    });

    return unsubscribe; // ทำการ unsubscribe เมื่อ component unmount
  }, []);

  if (loggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      
        <StackNavigator loggedIn={loggedIn} />
   
        

    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
