// Chatbot.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Chatbot() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chatbot</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Chatbot;
