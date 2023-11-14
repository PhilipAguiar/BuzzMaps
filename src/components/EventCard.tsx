import { InfoBox, InfoWindow } from "@react-google-maps/api";
import { Event, User } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { styled } from "styled-components/macro";
import { CardStyling } from "../UI/CardStylng";
import { secondaryColorDark } from "../UI/colors";
import { ButtonStyling } from "../UI/Button";
import { device } from "../UI/MediaQueries";
import { formatDateToSentence } from "../utils/TimeStamp";
import { fetchUserAvatar, fetchUsername } from "../utils/UserList";

type Props = {
  event: Event | undefined;
  setSelected?: Function;
  joinEvent?: Function;
  getEvents?: Function;
  mapRef: React.RefObject<HTMLDivElement>;
};

const Container = styled.div`
  ${CardStyling};
  z-index: 6;
  display: flex;
  width: 97vw;
  max-height: 600px;
  overflow-y: auto;
  background-color: white;
  border: 7px solid #ef476f;

  @media ${device.tablet} {
    width: 50vw;
  }

  h3 {
    font-size: 2rem;
    padding-bottom: 0.3rem;
    margin-bottom: 0.3rem;
    font-weight: 700;
    text-align: center;
    border-bottom: 2px solid ${secondaryColorDark};
  }

  p,
  a {
    font-size: 1.4rem;
    color: black;
    margin: 0.3rem 1rem;
    padding-left: 1rem;
  }
  a {
    color: blue;
  }

  span {
    font-size: 1.4rem;
    color: black;
    margin: 0.3rem 0rem;
    /* padding-left: 1rem; */

    color: ${secondaryColorDark};
    font-weight: 700;
  }
`;

const UserList = styled.div`
  margin: 0 1rem;
  padding-left: 1rem;
`;

const UserDiv = styled.div`
  display: flex;
  border: 2px solid ${secondaryColorDark};
  border-radius: 40px;
  padding: 0 0.2rem;
  align-items: center;
  height: 3rem;
  width: 40%;

  img {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 20px;
  }

  p {
    padding-left: 0.3rem;
  }
`;

const Button = styled.button`
  ${ButtonStyling}
  font-size: 1.1rem;
  height: 1rem;
  width: 8rem;
  margin: 1rem auto 0.5rem;
`;

function EventCard({ event, setSelected, joinEvent, getEvents, mapRef }: Props) {
  const { currentUser } = useAuth();
  const [userInEvent, setUserInEvent] = useState<boolean>();
  // const [pageWidth, setPageWidth] = useState<number>();

  const position = new google.maps.LatLng(event!.location);

  const findUserIndex = () => {
    if (currentUser) {
      return event!.usersInterested.findIndex((userID) => {
        return userID === currentUser.uid;
      });
    }
  };
  const [userInfo, setUserInfo] = useState<{ name: string; avatar: string }[]>([]);

  useEffect(() => {
    if (event && event.usersInterested) {
      const fetchUserinfo = async () => {
        const avatarPromises = event.usersInterested.map(async (userID) => {
          const avatar = await fetchUserAvatar(userID);
          const name = await fetchUsername(userID);
          return { avatar, name };
        });

        const info = await Promise.all(avatarPromises);
        setUserInfo(info);
      };

      fetchUserinfo();
    }
  }, [event]);

  useEffect(() => {
    if (event!.usersInterested && currentUser) {
      if (findUserIndex() !== -1) {
        setUserInEvent(true);
      } else {
        setUserInEvent(false);
      }
    }
  }, []);

  const options = {
    boxStyle: {
      zIndex: 40,
      display: "flex",
      justifyContent: "center",
      overflowY: "hidden",
      backgroundColor: "transparent",
      width: "100%",
      maxHeight: "650px",
    },
    alignBottom: true,
    closeBoxURL: "",
    pixelOffset: new google.maps.Size(-(mapRef.current?.clientWidth || 0) / 2, 0),
  };

  return (
    <InfoBox
      position={position}
      options={options}
      onCloseClick={() => {
        if (setSelected) {
          setSelected(null);
        }
      }}
    >
      <Container>
        <h3>{event!.eventName ? event!.eventName : "Event Name Here"}</h3>

        <p>
          <span>Location: </span>
          {event!.eventLocation}
        </p>

        <p>
          <span>Date: </span>
          {event?.eventDate && formatDateToSentence(event!.eventDate)}
        </p>

        <p>
          <span>Description: </span>
          {event!.eventDescription}
        </p>

        <p>
          <span>Event Size: </span>
          {event!.eventSize}
        </p>

        <p>
          <span>Comments: </span>
          {event!.comments ? event!.comments.length : "No Comments Yet"}
        </p>

        {joinEvent && <Link to={`event/${event!.id}`}>Click to see more info.</Link>}

        {userInfo.length > 0 && (
          <UserList>
            {event!.usersInterested.map((user, i) => {
              const avatar = userInfo[i].avatar; // Get the avatar URL from the userAvatars state
              const username = userInfo[i].name;
              return (
                <UserDiv key={i}>
                  <img src={avatar} alt="" />
                  <p>{username}</p>
                </UserDiv>
              );
            })}
          </UserList>
        )}

        {joinEvent && currentUser && (
          <Button
            onClick={() => {
              const newEvent: Event = event!;
              const { uid, displayName, photoURL } = currentUser;

              const userIndex = findUserIndex();

              if (userIndex === -1) {
                const newUser: User = {
                  id: uid,
                  displayName,
                  avatar: photoURL,
                };
                newEvent.usersInterested.push(newUser.id);
                setUserInEvent(true);
              } else {
                newEvent.usersInterested.splice(userIndex!, 1);
                setUserInEvent(false);
              }
              joinEvent(newEvent);
              getEvents!();
            }}
          >
            {userInEvent ? "Leave" : "Join"}
          </Button>
        )}
      </Container>
    </InfoBox>
  );
}

export default EventCard;
