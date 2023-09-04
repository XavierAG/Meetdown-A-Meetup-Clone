import { csrfFetch } from "./csrf";

const SET_EVENT = "event/setEvent";
const SET_EVENTS = "event/setEvents";
const DELETE_EVENT = "event/deleteEvent";
const SET_IMAGE = "group/setImg";

const setEvent = (event) => {
  return {
    type: SET_EVENT,
    payload: event,
  };
};
const setEvents = (event) => {
  return {
    type: SET_EVENTS,
    payload: event,
  };
};
const removeEvent = () => {
  return {
    type: DELETE_EVENT,
  };
};
const setImg = (img) => {
  return {
    type: SET_IMAGE,
    payload: img,
  };
};

export const fetchEvent = (eventId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/events/${eventId}`);
    if (response.ok) {
      const eventDetails = await response.json();
      dispatch(setEvent(eventDetails.Events[0]));
      return eventDetails;
    } else {
      throw new Error("Failed to fetch event data");
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchAllEvents = () => async (dispatch) => {
  try {
    const response = await fetch("/api/events");
    if (response.ok) {
      const events = await response.json();
      dispatch(setEvents(events));
      return events;
    } else {
      throw new Error("Failed to fetch events data");
    }
  } catch (error) {
    console.log(error);
  }
};

export const createEvent = (groupId, payload) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const newEvent = await response.json();
      dispatch(setEvents(newEvent));
      return newEvent;
    }
  } catch (error) {
    const data = await error.json();
    return data;
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(removeEvent());
      return true;
    } else {
      const data = await response.json();
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const addEventImage = (imgPayload) => async (dispatch) => {
  try {
    const response = await csrfFetch(
      `/api/events/${imgPayload.eventId}/images`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imgPayload),
      }
    );
    if (response.ok) {
      const newImage = await response.json();
      dispatch(setImg(newImage));
      return newImage;
    }
  } catch (error) {
    const data = error.json();
    return data;
  }
};

const initialState = { allEvents: {}, singleEvent: {}, image: {} };

const eventReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_EVENT:
      newState = { ...state, singleEvent: action.payload };
      return newState;
    case SET_EVENTS:
      newState = { ...state, allEvents: action.payload };
      return newState;
    case DELETE_EVENT:
      newState = Object.assign({}, state);
      newState.allEvents = null;
      return newState;
    case SET_IMAGE:
      newState = Object.assign({}, state);
      newState.image = action.payload;
      return newState;
    default:
      return state;
  }
};

export default eventReducer;
