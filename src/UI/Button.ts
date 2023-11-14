import { css } from "styled-components/macro";
import { secondaryColorDark, secondaryColorLight } from "./colors";

export const ButtonStyling = css`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${secondaryColorLight};
  border: 3px solid ${secondaryColorDark};
  border-radius: 1rem;
  color: white;
  padding: 1.5rem;

  &:hover {
    background-color: ${secondaryColorDark};
  }

  &:active {
    translate: 5px 5px;
  }
`;
