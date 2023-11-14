import axios from "axios";
import { User } from "../types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const BASE_URL: string = "https://close-around-2.web.app";

// const BASE_URL: string = "http://localhost:5000";

export const addNewUser = async (user: User) => {
  return await axios.post(`${BASE_URL}/users`, user);
};

export const fetchUserAvatar = async (userID: string) => {
  try {
    const userRef = doc(db, "UserList", `${userID}`);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Assuming the user's image URL is stored in the 'photoURL' field
      const imageURL = userDoc.data()?.avatar || null;
      return imageURL;
    } else {
      console.log("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user image:", error);
    return null;
  }
};

export const fetchUsername = async (userID: string) => {
  try {
    const userRef = doc(db, "UserList", `${userID}`);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Assuming the user's image URL is stored in the 'photoURL' field
      const username = userDoc.data()?.displayName || null;
      return username;
    } else {
      console.log("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user image:", error);
    return null;
  }
};
