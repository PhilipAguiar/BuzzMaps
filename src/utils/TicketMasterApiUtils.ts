import axios from "axios";

import tmLogo from "../assets/ticketmaster-logo.png";
import { Category, Event, Venue } from "../types";

const BASE_URL: string = "https://close-around-2.web.app";

// Testing
// const BASE_URL: string = "http://localhost:5000";

export const getVenues = async (lat: number, lng: number) => {
  return await axios.get(`${BASE_URL}/ticketmaster/venues?lat=${lat}&lng=${lng}`);
};

export const getVenue = async (venueId: string): Promise<Venue> => {
  return await axios.get(`${BASE_URL}/ticketmaster/venues/${venueId}`).then((res: any) => {
    const venue: Venue = {
      id: res.data.id,
      name: res.data.name,
      icon: tmLogo,
      venueEvents: [],
      location: { lat: Number(res.data.location.latitude), lng: Number(res.data.location.longitude) },
      image: res.data.images ? res.data.images[0].url : null,
    };
    return venue;
  });
};

export const getTicketMasterEvent = async (id: string): Promise<Event> => {
  return await axios.get(`${BASE_URL}/ticketmaster/event/${id}`).then(async (res) => {
    const event = res.data;
    let tmData = await getTicketMasterComments(event.id);
    let comments = [];
    let usersInterested = [];
    if (tmData.comments) {
      comments = tmData.comments;
    }

    if (tmData.usersInterested) {
      usersInterested = tmData.usersInterested;
    }

    const category: Category = { main: "", subcategories: [], active: true };

    if (event.classifications[0]) {
      const { genre, subGenre, segment } = event.classifications[0];

      if (segment && segment.name !== "Undefined") {
        category.main = segment.name;
      }
      if (genre && genre.name !== "Undefined") {
        category.subcategories.push({ name: genre.name, active: true });
      }
      if (subGenre && subGenre.name !== "Undefined") {
        category.subcategories.push({ name: subGenre.name, active: true });
      }
    }

    const newEvent: Event = {
      id: event.id,
      location: {
        lat: Number(event._embedded.venues[0].location.latitude),
        lng: Number(event._embedded.venues[0].location.longitude),
      },
      eventName: event.name,
      eventDescription: event.info,
      eventDate: new Date(event.dates.start.localDate).toDateString(),
      eventLocation: event._embedded.venues[0].name,
      userSubmitted: "TicketMaster",
      usersInterested: usersInterested,
      comments: comments,
      icon: tmLogo,
      link: event.url,
      category: category,
      images: [event.images[0].url],
    };
    return newEvent;
  });
};

export const getEventsByVenue = async (venueId: string) =>
  axios.get(`${BASE_URL}/ticketmaster/venues/events/${venueId}`).then((res) => {
    const newVenueEvents: Array<Event> = [];
    const venueCategories: Array<Category> = [];

    res.data._embedded?.events.forEach((event: any) => {
      const category: Category = { main: "", subcategories: [], active: true };
      if (event.classifications[0]) {
        const { genre, subGenre, segment } = event.classifications[0];
        if (segment && segment.name !== "Undefined") {
          category.main = segment.name;
        }
        if (genre && genre.name !== "Undefined") {
          category.subcategories.push({ name: genre.name, active: true });
        }
        if (subGenre && subGenre.name !== "Undefined") {
          category.subcategories.push({ name: subGenre.name, active: true });
        }
      }

      const newEvent: Event = {
        id: event.id,
        location: {
          lat: Number(event._embedded.venues[0].location.latitude),
          lng: Number(event._embedded.venues[0].location.longitude),
        },
        eventName: event.name,
        eventDescription: event.url,
        eventDate: new Date(event.dates.start.localDate).toDateString(),
        eventLocation: event._embedded.venues[0].name,
        userSubmitted: "TicketMaster",
        usersInterested: [],
        comments: [],
        images: [event.images[0].url],
        category: category,
      };

      venueCategories.push(category);
      newVenueEvents.push(newEvent);
    });
    return { events: newVenueEvents, categories: venueCategories };
  });

export const getTicketMasterEvents = async (lat: number, lng: number, addVenue: Function, setLoading: Function) => {
  // Delay is for ticketmaster api fetch limit
  setLoading(true);
  try {
    await getVenues(lat, lng)
      .then((res) => {
        const venueList: Array<Venue> = [];
        new Promise((resolve, reject) => {
          res.data.forEach((venue: any, i: number) => {
            const newVenue: Venue = {
              id: venue.id,
              name: venue.name,
              venueEvents: [],
              location: { lat: Number(venue.location.latitude), lng: Number(venue.location.longitude) },
              icon: tmLogo,
              image: venue.images ? venue.images[0].url : null,
            };
            venueList.push(newVenue);
            if (i === res.data.length - 1) {
              resolve("");
            }
          });
        });
        return venueList;
      })
      .then((res) => {
        // Helper function to add a delay using setTimeout
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        res.forEach((venue: Venue, index: number) => {
          // Adding a delay of 200ms before processing each venue
          delay(250 * index).then(() => {
            getEventsByVenue(venue.id).then((res) => {
              if (res) {
                let newVenue: Venue = venue;
                newVenue.venueEvents = res.events;
                newVenue.categories = res.categories;
                addVenue(newVenue);
              }
            });
            if (index === res.length - 1) {
              setLoading(false);
            }
          });
        });
      });
  } catch {
    setLoading(false);
  }
};

export const editTicketMasterComments = async (comments: object, id: string) => {
  return await axios.post(`${BASE_URL}/ticketmaster/event/${id}/comments`, comments);
};

export const getTicketMasterComments = async (id: String) => {
  return await axios.get(`${BASE_URL}/ticketmaster/event/${id}/comments`).then((res) => {
    return res.data;
  });
};
