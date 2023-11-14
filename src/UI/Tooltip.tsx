// Tooltip.tsx
import React, { FC, ReactNode } from "react";
import styled from "styled-components";
import { primaryColorLight } from "./colors";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const TooltipContainer = styled.div`
  position: relative;
  justify-self: flex-end;
  display: inline-block;
  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipContent = styled.div`
  visibility: hidden;
  width: 10rem;
  background-color: white;
  border: 2px solid ${primaryColorLight};
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  top: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  padding: 0.4rem 0rem;
`;

const TooltipText = styled.div`
  font-size: 1.2;
  font-weight: 500;
  font-style: "Poppins";
`;

const Tooltip: FC<TooltipProps> = ({ text, children }) => {
  return (
    <TooltipContainer>
      {children}
      <TooltipContent className="tooltip-text">
        <TooltipText>{text}</TooltipText>
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;
