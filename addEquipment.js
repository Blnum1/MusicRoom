import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; 

const equipmentData = [
  {
    id: 'E01',
    name: 'Microphone',
    detail: 'High-quality microphone for recording.',
    image: 'https://shop-image.readyplanet.com/8W-Fv3MmhxD7QzQWmH8JI6VVYs4=/e1758bc9cf1b4b529eafa3658cc22399',
    stock: 2,
  },
  {
    id: 'E02',
    name: 'Guitar',
    detail: 'Acoustic guitar for music rehearsals.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeO-VUs6h1v1XqCkhPMfYmtV9mVxv7yh4XTQ&s',
    stock: 2,
  },
  {
    id: 'E03',
    name: 'Keyboard',
    detail: 'Electric keyboard for performances.',
    image: 'https://m.media-amazon.com/images/I/71FobkNjTZL._AC_SL1500_.jpg',
    stock: 2,
  },
];

const addEquipmentToFirestore = async () => {
  try {
    const equipmentCollectionRef = collection(db, 'equipment');
    
    // ใช้ setDoc เพื่อกำหนด Document ID เอง
    equipmentData.forEach(async (equipment) => {
      const equipmentDocRef = doc(equipmentCollectionRef, equipment.id); // ใช้ ID ที่กำหนดเอง
      await setDoc(equipmentDocRef, equipment);
      console.log(`Added equipment: ${equipment.name}`);
    });

    console.log('All equipment added successfully.');
  } catch (error) {
    console.error('Error adding equipment: ', error);
  }
};

addEquipmentToFirestore();
