import { useEffect, useState } from "react";
import EventForm from "../components/EventForm";
import MapField from "../components/MapField/MapField";

import { Event, LatLng } from "../types";
import SideBar from "../components/Sidebar/SideBar";
import { styled } from "styled-components/macro";
import { device } from "../UI/MediaQueries";
import { useEventContext } from "../contexts/EventContext";

const Container = styled.div`
  height: calc(100vh - 3.5rem);
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

type Props = {
  eventFormActive: boolean;
  setEventFormActive: Function;
  setMapLoaded: Function;
};

function MapPage({ eventFormActive, setEventFormActive, setMapLoaded }: Props) {
  const [newEvent, setNewEvent] = useState<Event>();
  const [legendActive, setLegendActive] = useState<boolean>(true);
  const { loading } = useEventContext();

  useEffect(() => {
    setLegendActive(!loading);
  }, [loading]);

  return (
    <Container>
      <SideBar legendActive={legendActive} setLegendActive={setLegendActive} />
      <MapField
        eventFormActive={eventFormActive}
        setEventFormActive={setEventFormActive}
        setNewEvent={setNewEvent}
        newEvent={newEvent}
        setMapLoaded={setMapLoaded}
        setLegendActive={setLegendActive}
      />
      {eventFormActive && <EventForm newEvent={newEvent} setNewEvent={setNewEvent} setEventFormActive={setEventFormActive} />}
    </Container>
  );
}

export default MapPage;
