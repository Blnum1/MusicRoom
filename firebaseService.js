import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // นำเข้าไฟล์ firebase ของคุณ

// ฟังก์ชันสำหรับเพิ่มข้อมูลห้องเข้า Firestore
export const addRoomToDatabase = async (roomData) => {
  try {
    const docRef = await addDoc(collection(db, "rooms"), roomData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
