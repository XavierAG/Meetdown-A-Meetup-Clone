import { csrfFetch } from "./csrf";

const SET_EVENT = "event/setEvent";
const DELETE_EVENT = "event/deleteEvent";

const setEvent = (event) => {
  return {
    type: SET_EVENT,
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

export const createEvent = (event) => async (dispatch) => {
  const { city, state, name, about, type, private: isPrivate } = event;
  const response = await csrfFetch("/api/events", {
    method: "POST",
    body: JSON.stringify({
      name,
      about,
      type,
      private: !!isPrivate,
      city,
      state,
    }),
  });
  const data = await response.json();
  dispatch(setEvent(data.event));
  return response;
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

const initialState = { event: null };

const eventReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_EVENT:
      newState = Object.assign({}, state);
      newState.event = action.payload;
      console.log(newState);
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
