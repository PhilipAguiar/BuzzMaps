import axios from "axios";
import { Event } from "../types";
const BASE_URL: string = "https://close-around-2.web.app";

// const BASE_URL: string = "http://localhost:5000";

export const addUserEvent = async (event: Event) => {
  return await axios.post(`${BASE_URL}/user-events`, event);
};

export const getAllEvents = async () => {
  return await axios.get(`${BASE_URL}/user-events`).then((res) => {
    const output: Array<Event> = res.data;
    return output;
  });
};

export const editUserEvent = async (event: Event) => {
  return await axios.put(`${BASE_URL}/user-events/${event.id}`, event);
};

export const getUserEvent = async (id: String) => {
  return await axios.get(`${BASE_URL}/user-events/${id}`).then((res) => {
    const output: Event = res.data;

    return output;
  });
};
