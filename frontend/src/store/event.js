import { csrfFetch } from "./csrf";

const SET_EVENT = "event/setEvent";
const SET_EVENTS = "event/setEvents";
const DELETE_EVENT = "event/deleteEvent";

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

export const fetchEvent = (eventId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/events/${eventId}`);
    if (response.ok) {
      const eventDetails = await response.json();
      console.log("help", eventDetails.Events[0]);
      dispatch(setEvent(eventDetails.Events[0]));
    } else {
      throw new Error("Failed to fetch event data");
    }
  } catch (error) {
    console.log(error);
  }
};

export const createEvent = (groupId, event) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: "POST",
      body: JSON.stringify(event),
    });
    if (response.ok) {
      const newEvent = await response.json();
      dispatch(setEvent(newEvent));
      return newEvent;
    } else {
      const data = await response.json();
      return false;
    }
  } catch (error) {
    return false;
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

const initialState = { allEvents: null, singleEvent: null };

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
      newState.event = null;
      return newState;
    default:
      return state;
  }
};

export default eventReducer;
