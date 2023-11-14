import { Event } from "../../types";
import { useEventContext } from "../../contexts/EventContext";
import { ListItem, ListItemContainer } from "../../UI/LegendItems";
import { useEffect, useRef, useState } from "react";

type Props = {
  event: Event;
  setLegendActive: React.Dispatch<React.SetStateAction<boolean>>;
};

function ListEventCard({ event }: Props) {
  const { selectedEvent } = useEventContext();

  return (
    <ListItemContainer
      $active={event === selectedEvent}
      onClick={() => {
        {
          // setSelectedVenue(event)
          // setLegendActive(false)
        }
      }}
    >
      <ListItem>{event.eventName}</ListItem>
    </ListItemContainer>
  );
}
export default ListEventCard;
