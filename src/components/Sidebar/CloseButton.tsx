import { styled } from "styled-components";
import expand from "../../assets/icons/expand-arrow.svg";
import collapse from "../../assets/icons/collapse-arrow.svg";
import { primaryColorDark, primaryColorLight } from "../../UI/colors";

const CloseButtonMobile = styled.button`
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  z-index: 6;
  height: 4rem;
  position: sticky;
  bottom: 0rem;
  background-color: ${primaryColorDark};
  outline: none;
  border: none;
  cursor: pointer;
  @media (min-width: 786px) {
    display: none;
  }
`;

const CloseButtonTablet = styled.button<{ $active: boolean }>`
  display: none;
  height: 100%;
  cursor: pointer;

  @media (min-width: 786px) {
    background-color: #003f88;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 6;
    width: 4rem;
    position: sticky;
    right: ${({ $active }) => ($active ? "-10px" : "0")};
    top: 0;
    bottom: 0;
    transition: background-color 0.1s;
    /* transition: width 0.3s; */
    border: none;
    border-left: solid 1px rgb(255, 255, 255, 0.3);
  }

  &:hover {
    box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    /* box-shadow: rgba(251, 251, 251, 0.22) 0px 22px 22px 0px; */

    .collapseArrow {
      padding-bottom: 0.25rem;
      scale: 1.06;
      /* transform: translateX(0px) rotate(-90deg); */
    }
    .expandArrow {
      padding-top: 0.25rem;
      scale: 1.02;
    }
  }
`;

const ExpandArrow = styled.img<{ $active: boolean }>`
  @media (min-width: 786px) {
    transition: padding-top 0.25s, transform 0.35s;

    width: 50px;
    height: 50px;
    transform: rotate(-90deg) translateY(-5px);
    margin-right: ${({ $active }) => ($active ? "53px" : "0")}; /* Use the active prop to set the margin-right */
  }
`;

const CollapseArrow = styled.img`
  @media (min-width: 786px) {
    transition: padding-bottom 0.25s, transform 0.35s;

    width: 50px;
    height: 50px;
    transform: rotate(-90deg) translateY(5px);
    margin-right: 10px;
  }
`;
type Props = {
  legendActive: boolean;
  setLegendActive: React.Dispatch<React.SetStateAction<boolean>>;
};

function CloseButton({ legendActive, setLegendActive }: Props) {
  return (
    <>
      <CloseButtonMobile
        onClick={() => {
          setLegendActive((prevValue) => !prevValue);
        }}
      >
        {legendActive ? (
          <CollapseArrow src={collapse} alt=""></CollapseArrow>
        ) : (
          <ExpandArrow $active={legendActive} src={expand} alt=""></ExpandArrow>
        )}
      </CloseButtonMobile>

      <CloseButtonTablet
        $active={legendActive}
        onClick={() => {
          setLegendActive((prevValue) => !prevValue);
        }}
      >
        {legendActive ? (
          <CollapseArrow className="collapseArrow" src={collapse} alt=""></CollapseArrow>
        ) : (
          <ExpandArrow className="expandArrow" $active={legendActive} src={expand} alt=""></ExpandArrow>
        )}
      </CloseButtonTablet>
    </>
  );
}
export default CloseButton;
