import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Event, Venue } from "../types";
import { getEventsByVenue, getVenue } from "../utils/TicketMasterApiUtils";
import { styled } from "styled-components/macro";
import { primaryColorLight, secondaryColorDark } from "../UI/colors";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${primaryColorLight};
  min-height: calc(100vh - 3.5rem);
  color: white;
`;
const Info = styled.div`
  color: ${secondaryColorDark};
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1rem 2rem;
  margin: 2rem 0 2rem;
  border: 5px solid ${secondaryColorDark};
  width: 80%;
  box-shadow: ${secondaryColorDark} 0px 5px 15px;
  h1 {
    font-size: 3rem;
    font-weight: 600;
    text-decoration: underline;
  }
`;

const VenueImage = styled.img`
  width: 20rem;
  height: 10rem;
`;
const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  text-align: center;
  border: 5px solid ${secondaryColorDark};
  width: 80%;
  margin: 1rem 0;
  padding: 1rem;
  color: ${secondaryColorDark};
  background-color: white;
  box-shadow: ${secondaryColorDark} 0px 5px 15px;
  P {
    font-size: 2rem;
    font-weight: bold;
    color: ${secondaryColorDark};
  }
`;

const Image = styled.img`
  width: 50%;
  border: 3px solid ${secondaryColorDark};
`;

function VenuePage() {
  const { id } = useParams();
  const [venueInfo, setVenueInfo] = useState<Venue>();
  const [venueEvents, setVenueEvents] = useState<Array<Event>>();

  const updatePage = async () => {
    setVenueInfo(await getVenue(id!));
    setVenueEvents((await getEventsByVenue(id!)).events);
  };

  useEffect(() => {
    updatePage();
  }, []);

  // useEffect(() => {
  //   console.log(venueInfo);
  // }, [venueInfo]);

  if (!venueEvents) {
    <p>No Venue Exists</p>;
  }

  return (
    <Container>
      {venueInfo && (
        <Info>
          <h1>{venueInfo.name}</h1>
          {venueInfo.image && <VenueImage src={venueInfo.image} alt="" />}
        </Info>
      )}

      {venueEvents &&
        venueEvents.map((event, index) => {
          return (
            <Card key={index}>
              {event.images && <Image src={event.images[0]}></Image>}
              <p>{event.eventName}</p>
              <p>{event.eventLocation}</p>
              <p>{event.eventDate}</p>

              <Link to={`/venue-event/${event.id}`}>More Info...</Link>
            </Card>
          );
        })}
    </Container>
  );
}
export default VenuePage;
