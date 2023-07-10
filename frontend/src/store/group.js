import { csrfFetch } from "./csrf";

const SET_GROUP = "session/setGroup";
const DELETE_GROUP = "session/removeGroup";
const SET_IMAGE = "session/setImg";

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
const setImg = (groupId, url, preview) => {
  return {
    type: SET_IMAGE,
    payload: { groupId, url, preview },
  };
};

export const createGroup = (group) => async (dispatch) => {
  const { city, state, name, about, type, private: isPrivate } = group;
  try {
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
    if (response.ok) {
      dispatch(createGroup());
      return true;
    } else {
      const data = await response.json();
      return false;
    }
  } catch (error) {
    return false;
  }
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

export const addGroupImage = (groupId, url, preview) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
      method: "POST",
      body: JSON.stringify({
        url,
        preview,
      }),
    });
    if (response.ok) {
      dispatch(addGroupImage());
      return true;
    } else {
      const data = await response.json();
      return false;
    }
  } catch (error) {
    return false;
  }
};

const initialState = { group: null, image: null };

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
    case SET_IMAGE:
      newState = Object.assign({}, state);
      newState.image = action.payload;
      return newState;
    default:
      return state;
  }
};

export default groupReducer;
