import express from "express";
import cors from "cors";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import ticketMasterRouter from "../routes/ticketmaster";
import userEventsRouter from "../routes/userEvents";
import usersRouter from "../routes/users";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

type Event = {
  id: string;
  lat: number;
  lng: number;
  icon?: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  userSubmitted: string;
  userAvatar: string;
  eventSize?: number;
  usersInterested: Array<string>;
};

const app = express();

// Middleware
app.use(express.static("public"));
app.use(cors());

// Routes
app.use("/ticketmaster", ticketMasterRouter);
app.use("/user-events", userEventsRouter);
app.use("/users", usersRouter);

admin.initializeApp();

export const removePastEvents = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  const currentDate = new Date();

  const querySnapshot = await getDocs(collection(db, "UserEvents"));

  const deletionPromises: Promise<void>[] = [];

  querySnapshot.forEach((doc) => {
    const event = doc.data() as Event;
    const targetDate = new Date(event.eventDate + "T00:00:00");
    console.log(targetDate.getTime(), currentDate.getTime());
    if (targetDate.getTime() < currentDate.getTime()) {
      const deletionPromise = deleteDoc(doc.ref); // Delete the entire document
      deletionPromises.push(deletionPromise);
    }
  });

  await Promise.all(deletionPromises);

  return null;
});

exports.app = functions.https.onRequest(app);
