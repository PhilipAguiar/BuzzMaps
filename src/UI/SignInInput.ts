import { css } from "@emotion/react";
import { styled } from "styled-components/macro";

export const SignInInputDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 1rem auto;
  max-width: 30rem;
`;

export const SignInInput = styled.input`
  width: 100%;
  border: 4px solid $tertiaryColorLight;
  height: 2rem;
  padding-left: 0.4rem;
  outline: none;

  label {
    color: white;
  }
`;
