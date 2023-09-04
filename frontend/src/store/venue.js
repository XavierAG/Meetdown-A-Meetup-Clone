import { csrfFetch } from "./csrf";

const SET_VENUE = "venue/setVenue";

const setVenue = (venue) => {
  return {
    type: SET_VENUE,
    payload: venue,
  };
};

export const createVenue = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/venues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: "123 Disney Lane",
        city: "New York",
        state: "NY",
        lat: 37.7645358,
        lng: -122.4730327,
      }),
    });
    if (response.ok) {
      const newVenue = await response.json();
      dispatch(setVenue(newVenue));
      return newVenue;
    }
  } catch (error) {
    const data = await error.json();
    return data;
  }
};

const initialState = { singleVenue: {} };
//Reducers
const venueReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_VENUE:
      newState = { ...state, singleVenue: action.payload };
      return newState;
    default:
      return state;
  }
};

export default venueReducer;
