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
import RegisterScreen from "./screens/RegisterScreen";
import Chatbot from "./screens/Chatbot";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
        },
        headerShown: false,
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

const StackNavigator = ({ loggedIn }) => { // เพิ่ม loggedIn เพื่อใช้กำหนดเส้นทาง
  return (
    <Stack.Navigator
      initialRouteName={loggedIn ? "Main" : "Login"} // ตรวจสอบสถานะล็อกอินเพื่อตั้ง initialRoute
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4CAF50",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitle: "Music Rooms",
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
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chatbot"
        component={Chatbot}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
