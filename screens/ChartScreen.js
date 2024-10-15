import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryPie } from "victory-native";
import { Dimensions } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // เชื่อมต่อ Firebase

const screenWidth = Dimensions.get("window").width;

const ChartScreen = () => {
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState([]);
  const [borrowingData, setBorrowingData] = useState([]);

  // ดึงข้อมูลการจองห้อง
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        const bookingTimes = bookingsSnapshot.docs.map(
          (doc) => doc.data().bookingTime
        );

        const borrowingsSnapshot = await getDocs(
          collection(db, "borrowHistory")
        );
        const borrowedEquipment = borrowingsSnapshot.docs.map(
          (doc) => doc.data().equipmentName
        );

        setBookingData(bookingTimes);
        setBorrowingData(borrowedEquipment);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // จัดเตรียมข้อมูลกราฟแท่ง
  const bookingCounts = bookingData.reduce((acc, time) => {
    acc[time] = (acc[time] || 0) + 1;
    return acc;
  }, {});

  const bookingChartData = Object.keys(bookingCounts).map((time) => ({
    x: time,
    y: bookingCounts[time],
  }));

  // จัดเตรียมข้อมูลกราฟวงกลม
  const borrowingCounts = borrowingData.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  const borrowingChartData = Object.keys(borrowingCounts).map((item) => ({
    x: item,
    y: borrowingCounts[item],
  }));

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.chartTitle}>Booking Time Chart (Horizontal)</Text>
        <VictoryChart
          width={screenWidth - 16}
          theme={VictoryTheme.material}
          domainPadding={{ x: 50 }} // เพิ่มค่า padding บนแกน X เพื่อให้แสดงชื่อเวลาครบถ้วน
        >
          <VictoryAxis dependentAxis tickValues={[1, 2, 3]} /> {/* กำหนดการแสดงเลขบนแกน Y */}
          <VictoryAxis
            style={{
              tickLabels: { angle: -45, fontSize: 10, padding: 10 }, // ปรับการหมุนและขนาดของชื่อแกน X
            }}
          />
          <VictoryBar
            horizontal
            data={bookingChartData}
            style={{
              data: { fill: "#ffa726", width: 20 },
            }}
          />
        </VictoryChart>

        <Text style={styles.chartTitle}>Borrowed Equipment Chart (Pie)</Text>
        <VictoryPie
          data={borrowingChartData}
          colorScale={["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]}
          labelRadius={({ innerRadius }) => innerRadius + 20}
          style={{
            labels: { fill: "#fff", fontSize: 16, fontWeight: "bold" },
          }}
          width={screenWidth - 16}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default ChartScreen;
