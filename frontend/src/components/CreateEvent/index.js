import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createEvent } from "../../store/event";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function CreateEvent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [price, setPrice] = useState("");
  const { groupId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const event = {
      venueId: 1,
      groupId: groupId,
      name,
      type,
      private: isPrivate === "1",
      capacity: 100,
      price,
      description,
      startDate,
      endDate,
    };

    const newEvent = await dispatch(createEvent(groupId, event));

    if (newEvent) {
      history.push(`/events/${newEvent.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Group Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {/* Other input fields */}
      <button type="submit">Create Event</button>
    </form>
  );
}

export default CreateEvent;
