import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { SignUpButton, SignUpFormContainer, SignUpPageContainer } from "./SignUpPage";
import { SignInInput, SignInInputDiv } from "../UI/SignInInput";

function LoginPage() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { login } = useAuth();
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  const submitHandler = (e: any) => {
    e.preventDefault();

    login(emailRef.current!.value, passwordRef.current!.value)
      .then(() => {
        navigate("/");
      })
      .catch((error: any) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        setErrorMessage("Error Logging In");
      });
  };

  return (
    <SignUpPageContainer
      onSubmit={(e: any) => {
        submitHandler(e);
      }}
    >
      <SignUpFormContainer>
        <h1>Login</h1>
        <p>{errorMessage}</p>

        <SignInInputDiv>
          <label>Email</label>
          <SignInInput ref={emailRef} type="email" placeholder="Email" autoComplete="on" required />
        </SignInInputDiv>

        <SignInInputDiv>
          <label>Password</label>
          <SignInInput ref={passwordRef} type="password" placeholder="Password" autoComplete="off" required />
        </SignInInputDiv>
        <SignUpButton>Login</SignUpButton>

        <p>Don't have an account?</p>
        <Link to={"/signup"}>Sign Up!</Link>
      </SignUpFormContainer>
    </SignUpPageContainer>
  );
}

export default LoginPage;
