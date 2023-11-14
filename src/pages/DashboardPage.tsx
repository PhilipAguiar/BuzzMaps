import { styled } from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    border-radius: 50%;
  }
`;

function DashboardPage() {
  const { currentUser, updateUsername, updateUser, updateUserAvatar } = useAuth();
  const { displayName: username, photoURL: userAvatar } = currentUser;
  const [userPhoto, setUserPhoto] = useState<File | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string>();
  const [changeNameActive, setChangeNameActive] = useState<boolean>();
  const [changePhotoActive, setChangePhotoActive] = useState<boolean>();
  const [newUsername, setNewUsername] = useState<string>(""); // Add the state to keep track of the input value

  const handleUpdateUsername = async () => {
    try {
      await updateUsername(newUsername);

      updateUser();
      window.location.reload();
    } catch (error) {
      console.error("Failed to update username:", error);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setUserPhoto(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserPhotoUrl(imageUrl);
    } else {
      setUserPhotoUrl("");
    }
  };

  const handlePhotoUpdate = async () => {
    try {
      if (userPhoto) {
        const storageRef = ref(storage, `userPhotos/${currentUser.uid}/avatar`);
        await uploadBytes(storageRef, userPhoto);
        const photoURL = await getDownloadURL(storageRef);

        // Update the user's photoURL in Firebase authentication
        await updateUserAvatar(photoURL);

        window.location.reload();
      }
    } catch (error) {
      console.log("Error updating user photo: ", error);
    }
  };

  console.log(currentUser.uid);
  return (
    <Container>
      {username && (
        <h2
          onClick={() => {
            setChangeNameActive((prevValue) => !prevValue);
          }}
        >
          {username}
        </h2>
      )}

      {changeNameActive && (
        <>
          <input
            type="text"
            placeholder="Enter a new name"
            onChange={(e) => {
              setNewUsername(e.target.value);
            }}
          />
          <button onClick={handleUpdateUsername} disabled={newUsername === ""}>
            Submit
          </button>
        </>
      )}

      {userAvatar && (
        <img
          onClick={() => {
            setChangePhotoActive((prevValue) => !prevValue);
          }}
          src={userAvatar}
        ></img>
      )}

      {changePhotoActive && (
        <>
          <input type="file" accept="image/*" placeholder="Select a new photo" onChange={handlePhotoChange} />
          <button onClick={handlePhotoUpdate} disabled={!userPhotoUrl}>
            Submit
          </button>
        </>
      )}

      {userPhotoUrl && <img src={userPhotoUrl}></img>}
    </Container>
  );
}
export default DashboardPage;
