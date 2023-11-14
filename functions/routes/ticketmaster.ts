import * as express from "express";
import { doc, getDoc, setDoc } from "firebase/firestore";

import axios from "axios";
import { db } from "../firebase";
const ticketmasterRouter = express.Router();

const API_KEY = "";

ticketmasterRouter.get("/venues", async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  const venues: any = [];

  const venuesRes = await axios.get(
    `https://app.ticketmaster.com/discovery/v2/venues?latlong=${lat},${lng}&apikey=${API_KEY}&size=200&radius=100&sort=distance,asc`
  );
  venuesRes.data._embedded.venues.forEach((venue: any) => {
    if (venue.upcomingEvents._total > 0) {
      venues.push(venue);
    }
  });

  if (venuesRes.data.page.totalPages > 1) {
    const venuesRes2 = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/venues?latlong=${lat},${lng}&apikey=${API_KEY}&size=200&radius=100&sort=distance,asc&page=2`
    );
    venuesRes2.data._embedded.venues.forEach((venue: any) => {
      if (venue.upcomingEvents._total > 0) {
        venues.push(venue);
      }
    });
  }

  if (venuesRes.data.page.totalPages > 2) {
    const venuesRes2 = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/venues?latlong=${lat},${lng}&apikey=${API_KEY}&size=200&radius=100&sort=distance,asc&page=3`
    );
    venuesRes2.data._embedded.venues.forEach((venue: any) => {
      if (venue.upcomingEvents._total > 0) {
        venues.push(venue);
      }
    });
  }

  res.status(200).json(venues);
});

ticketmasterRouter.get("/venues/:id", async (req, res) => {
  try {
    axios.get(`https://app.ticketmaster.com/discovery/v2/venues/${req.params.id}.json?apikey=${API_KEY}`).then((axiosRes) => {
      res.status(200).json(axiosRes.data);
    });
  } catch {
    res.status(500).json("error receiving ticketmaster data");
  }
});

ticketmasterRouter.get("/venues/events/:id", async (req, res) => {
  try {
    const axiosRes = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?size=15&apikey=${API_KEY}&venueId=${req.params.id}`);
    res.status(200).json(axiosRes.data);
  } catch (error: any) {
    console.error("Error while fetching ticketmaster data:", error.message);
    res.status(500).json("Error receiving ticketmaster data. Please try again later.");
  }
});

ticketmasterRouter.get("/event/:id", (req, res) => {
  try {
    axios.get(`http://app.ticketmaster.com/discovery/v2/events/?id=${req.params.id}&apikey=${API_KEY}`).then((axiosRes) => {
      if (axiosRes.data._embedded.events[0]) {
        res.status(200).json(axiosRes.data._embedded.events[0]);
      }
    });
  } catch {
    res.status(500).json("error receiving ticketmaster data");
  }
});

ticketmasterRouter.get("/event/:id/comments", async (req, res) => {
  const snapshot = await getDoc(doc(db, "TicketMasterExtraInfo", req.params.id));

  res.send(snapshot.data());
});

ticketmasterRouter.post("/event/:id/comments", async (req, res) => {
  await setDoc(doc(db, "TicketMasterExtraInfo", req.params.id), req.body);

  res.json("comment sent");
});

export default ticketmasterRouter;
