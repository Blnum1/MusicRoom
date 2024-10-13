import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const BorrowScreen = () => {
  const [equipmentData, setEquipmentData] = useState([]); 
  const navigation = useNavigation(); 

  const fetchEquipmentData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "equipment"));
      const equipmentList = querySnapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data(),
      }));
      setEquipmentData(equipmentList); 
    } catch (error) {
      console.error("Error fetching equipment data: ", error);
    }
  };

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetail}>{item.detail}</Text>
        <TouchableOpacity
          style={styles.borrowButton}
          onPress={() => {
            console.log("Navigating to BorrowDetail with ID:", item.id);
            navigation.navigate("BorrowDetail", { id: String(item.id) });
          }}
        >
          <Text style={styles.borrowText}>Borrow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={equipmentData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  borrowButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  borrowText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default BorrowScreen;
