import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import NontiScreen from './screens/NontiScreen';
import ProfileScreen from './screens/ProfileScreen';
import { NavigationContainer } from "@react-navigation/native";


import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from '@expo/vector-icons/Ionicons';
import Homescreen from './screens/Homescreen';
const Stack = createStackNavigator();

const StackNavigator = () => {
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    
    function BottomTabs() {
        return (
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={Homescreen}
              options={{
                tabBarLabel: "Home",
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Entypo name="home" size={24} color="black" />
                  ) : (
                    <AntDesign name="home" size={24} color="black" />
                  ),
              }}
            />
    
    <Tab.Screen
              name="Nonti"
              component={NontiScreen}
              options={{
                tabBarLabel: "Nonti",
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Ionicons name="notifications-sharp" size={24} color="black" />
                  ) : (
                    <Ionicons name="notifications-outline" size={24} color="black" />
                  ),
              }}
            />
    
    <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarLabel: "Profile",
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Ionicons name="person" size={24} color="black" />
                  ) : (
                    <Ionicons name="person-outline" size={24} color="black" />
                  ),
              }}
            />
    
          </Tab.Navigator>
        );
      }
    
      return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={BottomTabs} />
            </Stack.Navigator>
        </NavigationContainer>
      );
    };
    
    export default StackNavigator;
    
    const styles = StyleSheet.create({});