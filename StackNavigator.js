import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";

import NontiScreen from "./screens/NontiScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Homescreen from "./screens/Homescreen";
import BookingScreen from "./screens/BookingScreen";
import BookingDetail from "./screens/BookingDetail";
import BorrowScreen from "./screens/BorrowScreen";
import BorrowDetail from "./screens/BorrowDetail";
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 70, // ปรับความสูงของแท็บบาร์
          paddingBottom: 10, // เพิ่ม padding ด้านล่างเพื่อเว้นระยะ
        },
        headerShown: false, // ซ่อน Header ของ Tab.Navigator
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Homescreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="black" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="NontiTab"
        component={NontiScreen}
        options={{
          tabBarLabel: "Nonti",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="notifications-sharp" size={24} color="black" />
            ) : (
              <Ionicons name="notifications-outline" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
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

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4CAF50", // สีพื้นหลังของ Header
        },
        headerTintColor: "#fff", // สีของข้อความใน Header
        headerTitleStyle: {
          fontWeight: "bold", // ปรับแต่ง Style ของ Title
        },
        headerTitle: "Music Rooms", // ตั้งชื่อ Header ให้คงที่เป็น "Music Rooms"
      }}
    >
      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetail}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Borrow"
        component={BorrowScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="BorrowDetail"
        component={BorrowDetail}
        options={{ title: "Borrow Detail" }}
      />
      <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
