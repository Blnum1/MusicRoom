const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Cloud Function สำหรับรีเซ็ตสถานะการจองเมื่อจบวัน
exports.resetRoomStatusDaily = functions.pubsub
    .schedule("every day 00:00")
    .onRun(async (context) => {
      const roomsSnapshot = await db.collection("rooms").get();

      const batch = db.batch();

      roomsSnapshot.forEach((roomDoc) => {
        batch.update(roomDoc.ref, {booked: false});
      });

      await batch.commit();
      console.log("Room statuses reset successfully");
      return null;
    });
