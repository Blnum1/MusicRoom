// Chatbot.js
import React from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
const chatbotImage = require('../assets/LineChat.png');

function Chatbot() {const openLineLink = () => {
  // แทนที่ @LINE_ID ด้วย LINE ID ของ Chatbot ของคุณ
  const lineUrl = 'https://line.me/R/ti/p/@741uodam';
  Linking.openURL(lineUrl).catch((err) => console.error('An error occurred', err));
};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chatbot</Text>
      <View style={styles.imageContainer}>
        <Image source={chatbotImage} style={styles.image} />
      </View>
      <TouchableOpacity style={styles.button} onPress={openLineLink}>
        <Text style={styles.buttonText}>เพิ่มเพื่อนใน LINE @741uodam</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  imageContainer: {
    width: 250, // กำหนดความกว้างของกล่อง
    height: 250, // กำหนดความสูงของกล่อง
    borderRadius: 5, // ทำให้มุมกลม
    overflow: 'hidden', // เพื่อไม่ให้รูปภาพออกมานอกกล่อง
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%', // ให้รูปภาพเต็มความกว้างของกล่อง
    height: '100%', // ให้รูปภาพเต็มความสูงของกล่อง
    resizeMode: 'contain', // ทำให้รูปภาพแสดงโดยไม่ถูกบิดเบี้ยว
  },
  button: {
    backgroundColor: '#00B900', // สีเขียวเหมือนใน LINE
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Chatbot;
