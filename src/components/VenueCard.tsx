import { Circle, InfoBox, InfoBoxF, InfoWindow, OverlayView } from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Venue } from "../types";
import { styled } from "styled-components/macro";
import { CardStyling } from "../UI/CardStylng";
import { device } from "../UI/MediaQueries";
import { primaryColorLight } from "../UI/colors";

type Props = {
  venue: Venue;
  setSelected: Function;
  mapRef: React.RefObject<HTMLDivElement>;
};

const Container = styled.div`
  ${CardStyling}
  z-index: 5;
  display: flex;
  width: 97vw;
  max-height: 600px;
  overflow-y: auto;
  align-items: center;
  background-color: ${primaryColorLight};
  border: 1px solid ${primaryColorLight};

  @media ${device.tablet} {
    width: 100%;
    max-width: 400px;
  }
`;

const Header = styled.div`
  background-color: ${primaryColorLight};
  color: white;
  backdrop-filter: blur(5px);
  position: sticky;
  position: -webkit-sticky;
  border-bottom: 1px solid rgb(255, 255, 255, 0.2);
  top: 0;
  width: 100%;
  text-align: center;
  padding: 0.5rem 0;
`;
const Title = styled.h2`
  font-size: 2rem;
`;
const StyledLink = styled(Link)`
  color: white;
  text-decoration: underline white;
  font-size: 1rem;
`;

const Info = styled.div`
  display: flex;
  width: 85%;
  padding: 0rem 1.8rem;
  border-bottom: 2px solid rgb(255, 255, 255, 0.2);

  @media ${device.tablet} {
    padding: 1rem 1.8rem;
  }

  img {
    margin: 1rem auto;
    width: 40%;
    @media ${device.tablet} {
      width: 80%;
    }
  }
`;

const EventContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // width: 100%;
  background-color: white;
  height: 100%;
`;

const Event = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 1rem 1.83rem;
  border-bottom: 1px solid gray;
  box-shadow: 0 4px 2px -2px gray;
  background-color: white;
  min-height: 7rem;
  box-sizing: border-box;
  width: 100%;

  &:first-child {
    border-top: 1px solid gray;
  }
  &:nth-child(odd) {
    background-color: rgb(238, 238, 238);
  }
`;

const VenueWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 5rem;
  width: 100%;

  img {
    width: 40%;
  }
`;

const TextWrapper = styled.div`
  display: flex;

  margin-left: 1rem;
  flex-direction: column;
  justify-content: center;

  p,
  span {
    font-size: 1rem;
    margin-bottom: 5px;
    width: 100%;
  }

  span {
    font-weight: 700;
  }
  a {
    color: blue;
    font-size: 0.9rem;
    text-decoration: underline blue;
  }
`;

const EventName = styled.p`
  font-size: 1rem;
  font-weight: 800;
  width: 100%;
`;
const EventDate = styled.p`
  font-size: 0.7rem;
  font-weight: 400;
  width: 100%;
  color: rgb(0, 0, 0, 0.5);
`;

function VenueCard({ venue, setSelected, mapRef }: Props) {
  const position = new google.maps.LatLng(venue!.location);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollTop = 0;
    }
  }, [venue]);

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
    <InfoBox position={position} options={options}>
      <Container ref={cardRef}>
        <Header>
          {venue.image && (
            <Info>
              <img src={venue.image} alt="" />
            </Info>
          )}

          <Title>{venue.name}</Title>
          <StyledLink to={`venue/${venue!.id}`}>
            <p>Click to see all events.</p>
          </StyledLink>
        </Header>

        <EventContainer>
          {venue.venueEvents.map((event, i) => {
            return (
              <Event key={i}>
                <VenueWrapper>
                  {event.images && <img src={event.images[0]} alt="" />}
                  <TextWrapper>
                    <EventName>{event.eventName}</EventName>

                    <EventDate>{new Date(event.eventDate).toDateString()}</EventDate>

                    <Link to={`/venue-event/${event.id}`}>More info</Link>
                  </TextWrapper>
                </VenueWrapper>
              </Event>
            );
          })}
        </EventContainer>
      </Container>
    </InfoBox>
  );
}

export default VenueCard;
