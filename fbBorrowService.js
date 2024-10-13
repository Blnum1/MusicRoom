import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // ไฟล์ firebase ของคุณ

const fetchEquipment = async (id) => {
  try {
    const equipmentRef = doc(db, 'equipment', id); // ดึงข้อมูลโดยใช้ ID ของ document
    const equipmentSnap = await getDoc(equipmentRef);

    if (equipmentSnap.exists()) {
      console.log('Equipment data:', equipmentSnap.data());
      return equipmentSnap.data(); // ส่งข้อมูลกลับ
    } else {
      throw new Error('Equipment not found'); // กรณีที่ไม่พบอุปกรณ์
    }
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error; // โยนข้อผิดพลาดกลับไป
  }
};
