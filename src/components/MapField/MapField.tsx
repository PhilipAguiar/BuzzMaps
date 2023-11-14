import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { Event, LatLng } from "../../types";
import VenueCard from "../VenueCard";
import mapStyle from "./mapStyles";
import NewEvent from "../NewEvent";
import EventCard from "../EventCard";
import { useAuth } from "../../contexts/AuthContext";
import { useEventContext } from "../../contexts/EventContext";
import { styled } from "styled-components/macro";
import { ButtonStyling } from "../../UI/Button";
import { device } from "../../UI/MediaQueries";

const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const libraries: ["places"] = [`places`];

const MapContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const Button = styled.button<{ $active: boolean }>`
  ${ButtonStyling}
  padding: 0;
  font-size: 1rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  position: absolute;
  height: 3rem;
  width: 15rem;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);

  @media ${device.tablet} {
    ${({ $active }) => ($active ? "height: 3rem" : "height: 5rem;")}
    font-size: 1.3rem;
    transition: height 0.5s;
  }
`;

type Props = {
  setEventFormActive: Function;
  eventFormActive: boolean;
  setNewEvent: Function;
  newEvent: Event | undefined;
  setMapLoaded: Function;
  setLegendActive: React.Dispatch<React.SetStateAction<boolean>>;
};

function MapField({ setEventFormActive, eventFormActive, setNewEvent, newEvent, setMapLoaded, setLegendActive }: Props) {
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null); // Add this state variable
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  const { userEventsList, selectedEvent, filteredVenueList, joinEvent, center, setSelectedEvent, getEvents, selectedVenue, setSelectedVenue } =
    useEventContext();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const options = {
    styles: mapStyle,
    disableDefaultUI: true,
    zoomControl: false,
    keyboardShortcuts: false,
    scrollwheel: selectedVenue || selectedEvent ? false : true,
  };

  const mapRef = React.useRef<google.maps.Map>();
  const onMapLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      filteredVenueList.map((venue) => {
        bounds.extend({
          lat: venue.location.lat,
          lng: venue.location.lng,
        });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [mapRef, filteredVenueList]);

  useEffect(() => {
    if (isLoaded) {
      setMapLoaded(true);
    }
  }, [isLoaded]);

  if (loadError) return <p>"Error loading maps"</p>;
  if (!isLoaded) return <p>"Loading Maps"</p>;

  return (
    isLoaded && (
      <MapContainer ref={containerRef}>
        <GoogleMap
          options={options}
          mapContainerStyle={mapContainerStyle}
          onLoad={onMapLoad}
          center={mapCenter || center} // Use the mapCenter state variable if it's set, otherwise use the 'center' prop
          zoom={15}
          onClick={(e) => {
            setSelectedVenue(null);
            setSelectedEvent(null);
            if (eventFormActive) {
              setNewEvent({
                location: {
                  lat: e.latLng!.lat(),
                  lng: e.latLng!.lng(),
                },
              });
            }
          }}
        >
          {filteredVenueList &&
            filteredVenueList.map((venue, i) => {
              let iconSize = 22;
              if (venue.venueEvents.length !== 0) {
                return (
                  <Marker
                    key={i}
                    position={venue.location}
                    icon={{
                      url: venue.icon,
                      scaledSize: new window.google.maps.Size(iconSize, iconSize),
                      anchor: new window.google.maps.Point(iconSize / 2, iconSize / 2),
                    }}
                    onClick={() => {
                      if (!eventFormActive) {
                        setSelectedVenue(venue);
                        setSelectedEvent(null);
                        // setMapCenter(venue.location); // Set the center to the venue's location on marker click
                      }
                    }}
                  />
                );
              }
              return null;
            })}
          {userEventsList &&
            userEventsList.map((event, i) => {
              return (
                <Marker
                  key={i}
                  position={event.location}
                  icon={{
                    url: event.icon!,
                    scaledSize: new window.google.maps.Size(36, 36),
                    anchor: new window.google.maps.Point(36 / 2, 36 / 2),
                  }}
                  onClick={() => {
                    if (!eventFormActive) {
                      setSelectedVenue(null);
                      setSelectedEvent(event);
                      // setMapCenter(event.location); // Set the center to the venue's location on marker click
                    }
                  }}
                />
              );
            })}

          {selectedVenue && <VenueCard venue={selectedVenue} setSelected={setSelectedVenue} mapRef={containerRef} />}

          {selectedEvent && (
            <EventCard event={selectedEvent} setSelected={setSelectedEvent} joinEvent={joinEvent} getEvents={getEvents} mapRef={containerRef} />
          )}

          {newEvent && <NewEvent newEvent={newEvent} mapRef={containerRef} />}
        </GoogleMap>

        {currentUser && (
          <Button
            $active={newEvent?.location ? true : false}
            onClick={() => {
              setSelectedEvent(null);
              setNewEvent(null);
              setLegendActive(false);
              setEventFormActive(!eventFormActive);
            }}
          >
            {!eventFormActive ? "Add New Event" : "Close"}
          </Button>
        )}
      </MapContainer>
    )
  );
}

export default MapField;
