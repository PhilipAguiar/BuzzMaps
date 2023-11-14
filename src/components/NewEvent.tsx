import { Marker } from "@react-google-maps/api";
import { Event } from "../types";
import Icons from "../icons/icons";
import EventCard from "./EventCard";
type Props = {
  newEvent: Event | undefined;
  mapRef: React.RefObject<HTMLDivElement>;
};

function NewEvent({ newEvent, mapRef }: Props) {
  return (
    <>
      <Marker
        position={newEvent!.location}
        icon={{
          url: newEvent?.icon ? newEvent!.icon! : Icons[0].image,
          scaledSize: new window.google.maps.Size(36, 36),
          anchor: new window.google.maps.Point(36 / 2, 36 / 2),
        }}
      />

      <EventCard event={newEvent} mapRef={mapRef} />
    </>
  );
}

export default NewEvent;
