import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
export default function App() {
  return (
    <> 
    <StackNavigator/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
