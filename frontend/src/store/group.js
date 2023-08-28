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
const setImg = (img) => {
  return {
    type: SET_IMAGE,
    payload: img,
  };
};

export const createGroup = (groupInfo) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupInfo),
    });
    if (response.ok) {
      const newGroup = await response.json();
      //console.log("response", response.json());
      console.log("newGroup", newGroup);
      dispatch(setGroup(newGroup));
      return newGroup;
    } else {
      const data = await response.json();
      return false;
    }
  } catch (error) {
    console.log("json response", JSON.stringify(groupInfo));
    console.log("error:", error);
    console.log("payload:", groupInfo);
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
      console.log("error");
      return false;
    }
  } catch (error) {
    return false;
  }
}; //ok

export const addGroupImage = (imgPayload) => async (dispatch) => {
  try {
    const response = await csrfFetch(
      `/api/groups/${imgPayload.groupId}/images`,
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
    } else {
      const data = await response.json();
      return false;
    }
  } catch (error) {
    console.log("imgPayload", imgPayload);
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
