import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signOut() {
    return auth.signOut();
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function getUser() {
    return auth.currentUser;
  }

  const updateUser = (name, avatar) => {
    return new Promise((resolve, reject) => {
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: avatar,
      })
        .then(async () => {
          const userRef = doc(db, "UserList", auth.currentUser.uid);
          await updateDoc(userRef, {
            displayName: name,
            avatar: avatar,
          });

          resolve(); // Resolve the Promise if the update is successful
        })
        .catch((error) => {
          reject(error); // Reject the Promise with the error if something goes wrong
        });
    });
  };

  const updateUsername = (name) => {
    return new Promise((resolve, reject) => {
      updateProfile(auth.currentUser, {
        displayName: name,
      })
        .then(async () => {
          const userRef = doc(db, "UserList", auth.currentUser.uid);
          await updateDoc(userRef, {
            displayName: name,
          });
          resolve(); // Resolve the Promise if the update is successful
        })
        .catch((error) => {
          reject(error); // Reject the Promise with the error if something goes wrong
        });
    });
  };

  const updateUserAvatar = (avatar) => {
    return new Promise((resolve, reject) => {
      updateProfile(auth.currentUser, {
        photoURL: avatar,
      })
        .then(async () => {
          const userRef = doc(db, "UserList", auth.currentUser.uid);
          await updateDoc(userRef, {
            avatar: avatar,
          });
          resolve(); // Resolve the Promise if the update is successful
        })
        .catch((error) => {
          reject(error); // Reject the Promise with the error if something goes wrong
        });
    });
  };
  // function isAdmin() {
  //   return auth.currentUser.getIdTokenResult().then((idTokenResult) => {
  //     if (!!idTokenResult.claims.admin) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // }

  // function isEditor() {}

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    getUser,
    login,
    signOut,
    signUp,
    updateUser,
    updateUsername,
    updateUserAvatar,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
