import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Menu from "../assets/menu.svg";
import { useState } from "react";
import Search from "./Search";
import { useEventContext } from "../contexts/EventContext";
import { styled } from "styled-components/macro";
import { device } from "../UI/MediaQueries";
import { primaryColorDark, primaryColorLight } from "../UI/colors";

type Props = {
  eventFormActive: boolean;
  mapLoaded: boolean;
};

const Container = styled.div`
  box-sizing: border-box;
  height: 3.5rem;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${primaryColorDark};
  /* border-bottom: rgb(255, 255, 255) 1px solid; */
  position: relative;
  ul {
    display: none;
    @media ${device.tablet} {
      display: flex;
      height: 100%;
      align-items: center;
      list-style: none;
    }
  }

  li,
  a {
    color: white;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    height: 100%;
    text-decoration: none;
    &:hover {
      background-color: ${primaryColorLight};
    }
  }
`;

const MobileMenu = styled.img`
  cursor: pointer;
  width: 2rem;
  margin: 0 1rem;

  @media ${device.tablet} {
    display: none;
  }
`;

const Logo = styled.h5`
  font-family: "Anton";
  font-size: 1.2rem;
  margin-left: 0.4rem;

  @media ${device.tablet} {
    font-size: 2rem;
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 50%;
  left: 50%;
  width: 60%;
  transform: translate(-50%, -50%);
`;
const MobileNav = styled.div<{ active: boolean }>`
  position: fixed;
  width: 100%;
  background-color: ${primaryColorLight};
  display: flex;
  justify-content: space-around;
  top: 0;
  right: 0;
  z-index: 6;
  margin-top: 3.5rem;
  border-top: 2px rgb(11, 56, 71) solid;
  border-bottom: 2px rgb(255, 255, 255) solid;
  box-shadow: ${primaryColorDark} 0px 5px 15px;

  height: ${({ active }) => (active ? "70px" : "1rem")};

  @media ${device.tablet} {
    display: none;
  }

  ul {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  li,
  a {
    color: white;
    border-bottom: 2px solid white;
    padding: 0.3rem 1rem;
    text-decoration: none;
    &:hover {
      background-color: ${primaryColorDark};
    }
    &:last-child {
      border-bottom: none;
    }
  }
`;

function Nav({ eventFormActive, mapLoaded }: Props) {
  const { currentUser, signOut } = useAuth();
  const [mobileListActive, setMobileListActive] = useState<boolean>();
  let location = useLocation();
  const { setCenter } = useEventContext();

  return (
    <Container>
      <Link to={"/"}>
        <Logo>BUZZMAPS</Logo>
      </Link>
      {location.pathname === "/" && mapLoaded && (
        <SearchContainer>
          <Search setCenter={setCenter} eventFormActive={eventFormActive} />
        </SearchContainer>
      )}

      <ul>
        <Link to={"/"}>Home</Link>
        {currentUser && <Link to={"/Dashboard"}>Dashboard</Link>}
        {!currentUser ? (
          <Link to={"/login"}>Login</Link>
        ) : (
          <li
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </li>
        )}
      </ul>
      <MobileMenu
        src={Menu}
        onClick={() => {
          setMobileListActive(!mobileListActive);
        }}
      />

      {mobileListActive && (
        <MobileNav active={mobileListActive}>
          <ul>
            <Link
              to={"/"}
              onClick={() => {
                setMobileListActive(!mobileListActive);
              }}
            >
              Home
            </Link>

            {!currentUser ? (
              <Link
                to={"/login"}
                onClick={() => {
                  setMobileListActive(!mobileListActive);
                }}
              >
                Login
              </Link>
            ) : (
              <li
                onClick={() => {
                  setMobileListActive(!mobileListActive);
                  signOut();
                }}
              >
                Sign Out
              </li>
            )}
          </ul>
        </MobileNav>
      )}
    </Container>
  );
}

export default Nav;
