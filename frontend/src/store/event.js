import { csrfFetch } from "./csrf";

const SET_EVENT = "session/setevent";
const DELETE_EVENT = "session/deleteevent";

const setevent = (event) => {
  return {
    type: SET_EVENT,
    payload: event,
  };
};
const removeevent = () => {
  return {
    type: DELETE_EVENT,
  };
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
  dispatch(setevent(data.event));
  return response;
};

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(removeevent());
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
