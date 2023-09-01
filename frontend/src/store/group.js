import { csrfFetch } from "./csrf";

//Types
const SET_GROUP = "group/setGroup";
const SET_GROUPS = "group/setGroups";
const DELETE_GROUP = "group/removeGroup";
const SET_IMAGE = "group/setImg";
const UPDATE_GROUP = "group/updateGroup";

//Action Creators
const setGroup = (group) => {
  // single // all //types action creator // reducers
  return {
    type: SET_GROUP,
    payload: group,
  };
};
const setGroups = (group) => {
  return {
    type: SET_GROUPS,
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
//Thunks
export const fetchGroup = (groupId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/groups/${groupId}`);
    if (response.ok) {
      const groupDetails = await response.json();
      console.log("what", groupDetails[0]);
      dispatch(setGroup(groupDetails.Groups[0]));
      return groupDetails;
    } else {
      throw new Error("Failed to fetch group data");
    }
  } catch (error) {
    console.log(error);
  }
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
      dispatch(setGroups(newGroup));
      return newGroup;
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

export const editGroup = (groupId, payload) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const updatedGroup = await response.json();
      dispatch(setGroups(updatedGroup));
      return updatedGroup;
    } else {
      const data = await response.json();
      return false;
    }
  } catch (error) {
    console.log("update error:", error);
    return false;
  }
};

const initialState = { allGroups: {}, singleGroup: {}, image: {} };
//Reducers
const groupReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_GROUP:
      newState = { ...state, singleGroup: action.payload };
      return newState;
    case SET_GROUPS:
      newState = { ...state, allGroups: action.payload };
      return newState;
    case DELETE_GROUP:
      newState = Object.assign({}, state);
      newState.allGroups = null;
      return newState;
    case SET_IMAGE:
      newState = Object.assign({}, state);
      newState.image = action.payload;
      return newState;
    case UPDATE_GROUP:
      newState = { ...state, allGroups: action.payload };
      return newState;
    default:
      return state;
  }
};

export default groupReducer;
