import { csrfFetch } from "./csrf";

const SET_GROUP = "session/setGroup";
const DELETE_GROUP = "session/deleteGroup";

const setGroup = (group) => {
  return {
    type: SET_GROUP,
    payload: group,
  };
};
const removeGroup = () => {
  return {
    type: DELETE_GROUP,
  };
};

export const createGroup = (group) => async (dispatch) => {
  const { city, state, name, about, type, private: isPrivate } = group;
  const response = await csrfFetch("/api/groups", {
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
  dispatch(setGroup(data.group));
  return response;
};

export const deleteGroup = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(removeGroup());
      return true;
    } else {
      const data = await response.json();
      return false;
    }
  } catch (error) {
    return false;
  }
};

const initialState = { group: null };

const groupReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_GROUP:
      newState = Object.assign({}, state);
      newState.group = action.payload;
      return newState;
    case DELETE_GROUP:
      newState = Object.assign({}, state);
      newState.group = null;
      return newState;
    default:
      return state;
  }
};

export default groupReducer;
