export type LatLng = {
  lat: number;
  lng: number;
};

export type Event = {
  id: string;
  location: LatLng;
  icon?: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  category?: Category;
  images?: Array<string>;
  userSubmitted: string;
  userAvatar?: string;
  eventSize?: number;
  link?: string;
  usersInterested: Array<string>;
  comments: Array<Comment>;
};

export type Venue = {
  id: string;
  name: string;
  icon: string;
  venueEvents: Array<Event>;
  location: LatLng;
  categories?: Array<Category>;
  image?: string;
};

export type User = {
  id: string;
  displayName: string;
  avatar: string;
  email?: string;
};

export type Comment = {
  id: string;
  date: number;
  user: User;
  content: string;
};

export type Category = {
  main: string;
  subcategories: Array<Subcategory>;
  active?: boolean;
};

export type Subcategory = {
  name: string;
  active?: boolean;
};
