import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteGroup } from "../../store/group";
import { deleteEvent } from "../../store/event";

function DeleteModal({ deleteContext }) {
  const { closeModal } = useModal();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleDelete = () => {
    switch (deleteContext.type) {
      case "Group":
        return dispatch(deleteGroup(deleteContext.groupId))
          .then(() => {
            history.push("/groups");
          })
          .then(closeModal);
      case "Event":
        return dispatch(deleteEvent(deleteContext.eventId))
          .then(() => {
            history.push(`/groups/${deleteContext.groupId}`);
          })
          .then(closeModal);
      default:
        closeModal();
        break;
    }
  };
  return (
    <>
      <h1>Confirm Delete</h1>
      <h3>{`Are you sure you want to delete this ${deleteContext.type}`}</h3>
      <div>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </>
  );
}

export default DeleteModal;
