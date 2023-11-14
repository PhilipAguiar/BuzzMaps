import { styled } from "styled-components/macro";
import { primaryColorLight } from "./colors";

export const ListItemContainer = styled.div<{ $active: boolean; $opacity?: number }>`
  cursor: pointer;
  /* margin: 0.27rem 0.6rem; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem 0;
  flex: 1;
  /* background-color: ${primaryColorLight}; */
  border-bottom: solid 1px rgb(255, 255, 255, 0.2);

  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out, height 2s;
  &:first-of-type {
    margin-top: 2rem;
  }

  &:hover {
    border: solid 1px rgb(255, 255, 255, 0.5);
  }

  a {
    max-height: ${({ $active }) => ($active ? "100px" : "0px")};
    overflow: hidden;
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    margin-top: ${({ $active }) => ($active ? "0.5rem" : "0px")};
    transition: max-height 0.2s ease-in-out, margin 0.2s ease-in-out;
    color: blue;
  }
`;

export const ListItem = styled.p`
  margin-left: 1rem;
  font-size: 1.1rem;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 1rem);
  font-family: Poppins;
  color: rgb(255, 255, 255);
`;
