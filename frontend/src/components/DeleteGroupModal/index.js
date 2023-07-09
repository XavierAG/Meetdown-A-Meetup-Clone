import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";

function DeleteGroupModal() {
  const dispatch = useDispatch();
  const sessionGroup = useSelector((state) => state.session.group);
  const history = useHistory();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sessionGroup) {
      dispatch(sessionActions.deleteGroup(group.id))
        .then(() => {
          history.push("/groups");
          closeModal();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <h2>Delete Group</h2>
      <p>Are you sure you want to delete this group?</p>
      <div>
        <button onClick={handleSubmit}>Delete</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

export default DeleteGroupModal;
