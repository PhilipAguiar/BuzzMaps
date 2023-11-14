import React, { createContext, useContext, useEffect, useState } from "react";
import { getTicketMasterEvents } from "../utils/TicketMasterApiUtils";
import { filterVenues, isMainCategoryInLegend, isSubcategoryInLegend } from "../utils/FilterVenues";
import { editUserEvent, getAllEvents } from "../utils/EventApiUtils";
import { Category, Event, Venue } from "../types";
import { LatLng } from "use-places-autocomplete";

type EventContextType = {
  venueList: Venue[];
  userEventsList: Event[];
  setUserEventsList: React.Dispatch<React.SetStateAction<Event[]>>;
  selectedEvent: Event | null;
  filteredVenueList: Venue[];
  addVenue: (venue: Venue) => void;
  joinEvent: (event: Event) => void;
  center: LatLng | undefined;
  setCenter: React.Dispatch<React.SetStateAction<LatLng | undefined>>;
  getEvents: Function;
  selectedVenue: Venue | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  setSelectedVenue: React.Dispatch<React.SetStateAction<Venue | null>>;
  legendFields: Category[];
  setLegendFields: React.Dispatch<React.SetStateAction<Category[]>>;
  activeSearchField: Category[];
  setActiveSearchField: React.Dispatch<React.SetStateAction<Category[]>>;
  loading: boolean;
};

// Use the EventContextType as the type argument for createContext
const EventContext = createContext<EventContextType>({
  venueList: [],
  userEventsList: [],
  selectedEvent: null,
  setUserEventsList: () => {},
  filteredVenueList: [],
  addVenue: () => {},
  joinEvent: () => {},
  center: undefined,
  setCenter: () => {},
  setSelectedEvent: () => {},
  getEvents: () => {},
  selectedVenue: null, // New
  setSelectedVenue: () => {}, // New
  legendFields: [],
  setLegendFields: () => {},
  activeSearchField: [],
  setActiveSearchField: () => {},
  loading: false,
});
export function useEventContext() {
  return useContext(EventContext);
}

const EventProvider = ({ children }: { children: React.ReactNode }) => {
  // State variables
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [center, setCenter] = useState<LatLng>();
  const [venueList, setVenueList] = useState<Venue[]>([]);
  const [userEventsList, setUserEventsList] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filteredVenueList, setFilteredVenueList] = useState<Venue[]>([]);
  const [legendFields, setLegendFields] = useState<Array<Category>>([]);
  const [activeSearchField, setActiveSearchField] = useState<Array<Category>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Define functions to be used by components to update state
  const addVenue = (venue: Venue) => {
    setVenueList((prevList) => [...prevList, venue]);
  };

  const joinEvent = (event: Event) => {
    const userEventsListCopy = userEventsList.slice(); // Create a copy of the array
    const eventIndex = userEventsListCopy.findIndex((e) => event.id === e.id);
    if (eventIndex !== -1) {
      userEventsListCopy[eventIndex] = event;
      setUserEventsList(userEventsListCopy);
    }
    editUserEvent(event);
    setSelectedEvent(event);
  };

  const getEvents = async () => {
    const eventList = await getAllEvents();
    setUserEventsList(eventList);
  };

  const filterVenuesByLegendFields = () => {
    setFilteredVenueList([...filterVenues(venueList, legendFields)]);
  };

  // const filterVenuesByActiveSearchField = () => {
  //   setFilteredVenueList([...filterVenues(venueList, activeSearchField)]);
  // };

  const checkForLocation = () => {
    if (!!localStorage.getItem("lat") && !!localStorage.getItem("lng")) {
      const lat = JSON.parse(localStorage.getItem("lat")!);
      const lng = JSON.parse(localStorage.getItem("lng")!);
      setCenter({ lat, lng });
    } else {
      setCenter({
        lat: 43.6532,
        lng: -79.3832,
      });
    }
  };

  useEffect(() => {
    checkForLocation();
  }, []);

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    if (center) {
      setVenueList([]);
      setFilteredVenueList([]);
      getTicketMasterEvents(center.lat, center.lng, addVenue, setLoading);
    }
  }, [center]);

  useEffect(() => {
    filterVenuesByLegendFields();
  }, [legendFields]);

  // useEffect(() => {
  //   filterVenuesByActiveSearchField();
  // }, [activeSearchField]);

  useEffect(() => {
    const newVenueList = venueList.filter((venue) => {
      // Check if the venue is already in the filteredVenueList
      return !filteredVenueList.some((filteredVenue) => filteredVenue.id === venue.id);
      // Replace "id" with the property that uniquely identifies each venue in your data
    });

    // Merge the existing filteredVenueList with the newVenueList
    setFilteredVenueList((prevList) => [...prevList, ...newVenueList]);
  }, [venueList]);

  useEffect(() => {
    filteredVenueList.forEach((venue) => {
      venue.categories?.forEach((category) => {
        if (category.main !== "Undefined") {
          if (!isMainCategoryInLegend(category, legendFields)) {
            legendFields.push(category);
          } else {
            category.subcategories.forEach((subcategory) => {
              if (!isSubcategoryInLegend(subcategory.name, legendFields)) {
                legendFields
                  .find((legendCategory) => {
                    return category.main === legendCategory.main;
                  })
                  ?.subcategories.push(subcategory);
              }
            });
          }
        }
      });
    });
  }, [filteredVenueList, legendFields]);

  // Define the context value to be shared with components

  // Return the context provider with the context value
  return (
    <EventContext.Provider
      value={{
        venueList,
        userEventsList,
        selectedEvent,
        filteredVenueList,
        addVenue,
        joinEvent,
        center,
        setCenter,
        setSelectedEvent,
        setUserEventsList,
        getEvents,
        selectedVenue,
        setSelectedVenue,
        legendFields,
        setLegendFields,
        activeSearchField,
        setActiveSearchField,
        loading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export { EventContext, EventProvider };
