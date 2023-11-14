import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addNewUser } from "../utils/UserList";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "../types";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components/macro";
import { primaryColorLight, tertiaryColorLight } from "../UI/colors";
import { SignInInput, SignInInputDiv } from "../UI/SignInInput";
import { ButtonStyling } from "../UI/Button";

export const SignUpPageContainer = styled.form`
  background-color: ${primaryColorLight};
  min-height: calc(100vh - 3.5rem);
`;

export const SignUpFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  h1 {
    padding-top: 4rem;
    font-size: 3rem;
    color: white;
    margin-bottom: 1rem;
    text-decoration: underline;
  }

  p {
    color: white;
    font-size: 1.8rem;
  }
`;

export const Upload = styled.p`
  cursor: pointer;
  color: white;
  padding: 1rem;
  margin: 1rem 0;
  border: 4px solid ${tertiaryColorLight};
`;

export const Avatar = styled.img`
  max-height: 30rem;
`;

export const SignUpButton = styled.button`
  ${ButtonStyling}
  border: none;
  margin: 1rem;
  height: 2rem;
`;

function SignUpPage() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { signUp, updateUser } = useAuth();
  const [uploadAvatar, setUploadAvatar] = useState<File>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const storage = getStorage();
  let navigate = useNavigate();

  const submitHandler = (e: any) => {
    e.preventDefault();

    signUp(emailRef.current!.value, passwordRef.current!.value)
      .then((userCredential: any) => {
        const user = userCredential.user;
        const avatarRef = ref(storage, `userAvatars/${user.uid}`);

        uploadBytes(avatarRef, uploadAvatar!).then(async (snapshot) => {
          const newUser: User = {
            id: user.uid,
            displayName: nameRef.current!.value,
            avatar: await getDownloadURL(avatarRef),
            email: emailRef.current!.value,
          };

          await updateUser(newUser.displayName, newUser.avatar);

          await addNewUser(newUser);

          navigate("/");
        });
      })

      .catch((error: any) => {
        const errorCode = error.code;
        // const errorMessage = error.message;

        if (errorCode === "auth/weak-password") {
          setErrorMessage("Password needs to be at least 6 characters");
        } else if ("auth/email-already-in-use") {
          setErrorMessage("Email already in use");
        } else {
          setErrorMessage("Error Logging In");
        }
      });
  };

  const handleChange = (e: any) => {
    setUploadAvatar(e.target.files[0]);
  };

  return (
    <SignUpPageContainer
      onSubmit={(e: any) => {
        submitHandler(e);
      }}
    >
      <SignUpFormContainer>
        <h1>Sign Up</h1>
        <p>{errorMessage}</p>

        <SignInInputDiv>
          <label>Email</label>
          <SignInInput ref={emailRef} type="email" placeholder="Email" required />
        </SignInInputDiv>

        <SignInInputDiv>
          <label>Password</label>
          <SignInInput ref={passwordRef} type="password" placeholder="Password" required />
        </SignInInputDiv>

        <SignInInputDiv>
          <label>Name</label>
          <SignInInput ref={nameRef} type="text" placeholder="Name" required />
        </SignInInputDiv>

        <Upload>
          Upload Profile Picture
          <input
            type="file"
            accept="image/png, image/jpg"
            name="avatar"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Upload>
        {uploadAvatar && <Avatar src={URL.createObjectURL(uploadAvatar)} alt="avatar" />}
        <SignUpButton>Create Account</SignUpButton>
      </SignUpFormContainer>
    </SignUpPageContainer>
  );
}

export default SignUpPage;
