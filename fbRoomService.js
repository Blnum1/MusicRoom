import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase'; // นำเข้า firebase auth และ Firestore

// ฟังก์ชันสำหรับบันทึกการจอง
export const bookRoom = async (roomId, roomName, bookingTime) => {
  const user = auth.currentUser;
  if (user) {
    const email = user.email;

    try {
      // ตรวจสอบว่ามีการจองช่วงเวลานี้แล้วหรือยัง
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('roomId', '==', roomId), where('bookingTime', '==', bookingTime));
      const existingBookings = await getDocs(q);

      if (!existingBookings.empty) {
        throw new Error('Time slot already booked'); // หากมีการจองช่วงเวลานี้แล้ว
      }

      // บันทึกการจองลงในคอลเล็กชัน "bookings"
      await addDoc(collection(db, 'bookings'), {
        email: email,
        roomId: roomId,
        roomName: roomName,
        bookingTime: bookingTime,
        status: 'booked', // สถานะของการจอง
        createdAt: serverTimestamp(), // เพิ่ม Timestamp เวลาการบันทึกการจอง
      });

      // อัปเดตสถานะของห้องเป็น "จองแล้ว"
      const roomDoc = doc(db, 'rooms', roomId);
      await updateDoc(roomDoc, {
        booked: true, // เปลี่ยนสถานะห้องเป็นจองแล้ว
      });

      console.log('Booking successful');
    } catch (error) {
      console.error('Error booking room: ', error);
      throw error;
    }
  } else {
    throw new Error('No user logged in');
  }
};
