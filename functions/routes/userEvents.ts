import { collection, doc, getDocs, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import * as express from "express";
import { db } from "../firebase";

const userEventsRouter = express.Router();

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

userEventsRouter.get("/", async (_req, res) => {
  const Events: Array<Event> = [];
  const querySnapshot = await getDocs(collection(db, "UserEvents"));
  querySnapshot.forEach((doc: any) => {
    // doc.data() is never undefined for query doc snapshots
    Events.push(doc.data());
  });
  res.json(Events);
});

userEventsRouter.post("/", async (req: any, res) => {
  const event: Event = req.body;

  // Update the "UserEvents" collection
  await setDoc(doc(db, "UserEvents", event.id), event);

  const userSubmitted = event.userSubmitted;

  const userDocRef = doc(db, "UserList", userSubmitted);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    const userDocData = userDocSnapshot.data();

    if (Array.isArray(userDocData?.events)) {
      // If "events" property is an array, use arrayUnion to add the event
      await updateDoc(userDocRef, {
        events: arrayUnion(event),
      });
    } else {
      // If "events" property doesn't exist or is not an array, initialize it as an array and add the event
      await updateDoc(userDocRef, {
        events: [event],
      });
    }
  } else {
    // Handle the case where the user document doesn't exist
    console.log("User document does not exist.");
  }

  res.status(200).send("User Event added to database!");
});

userEventsRouter.get("/:id", async (req, res) => {
  const docSnap = await getDoc(doc(db, "UserEvents", req.params.id));

  res.send(docSnap.data());
});

userEventsRouter.put("/:id", async (req, res) => {
  const event: Event = req.body;
  await setDoc(doc(db, "UserEvents", req.params.id), event);

  res.json(event);
});

export default userEventsRouter;
