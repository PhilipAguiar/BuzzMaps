import { styled } from "styled-components/macro";
import { Venue } from "../../types";
import { primaryColorDark, primaryColorLight } from "../../UI/colors";
import { Link } from "react-router-dom";
import { ListItem, ListItemContainer } from "../../UI/LegendItems";
import { useEventContext } from "../../contexts/EventContext";
import { useEffect, useRef, useState } from "react";

type Props = {
  venue: Venue;
  setLegendActive: (active: boolean) => void;
};

const ListImage = styled.img`
  height: 5rem;
  margin-bottom: 0.5rem;
  border-radius: 25px;
`;

const LinkBin = styled.div`
  flex-direction: row;
  width: 100%;
`;

function ListVenueCard({ venue, setLegendActive }: Props) {
  const { setSelectedVenue, selectedVenue } = useEventContext();

  return (
    <ListItemContainer
      $active={selectedVenue === venue}
      onClick={() => {
        {
          setSelectedVenue(venue);
          // setLegendActive(false)
        }
      }}
    >
      <LinkBin>
        {/* {venue.image && <ListImage src={venue.image} />} */}
        <ListItem>{venue.name}</ListItem>
      </LinkBin>
      <Link to={`/venue/${venue.id}`}>See All Events</Link>
    </ListItemContainer>
  );
}

export default ListVenueCard;
