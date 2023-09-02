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
  const [errors, setErrors] = useState({});

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

    try {
      const response = await dispatch(createEvent(groupId, event));

      if (response) {
        const newEvent = response;
        if (newEvent.errors) {
          setErrors(newEvent.errors);
          return;
        }
        if (newEvent) {
          // const imagePayload = {
          //   eventId: newEvent.event.id,
          //   url,
          //   preview: true,
          // };
          // const newImage = await dispatch(addEventImage(imagePayload));
          // if (newImage) {
          history.push(`/events/${newEvent.id}`);
          // }
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
      <label htmlFor="select">Is this an in-person or online group?</label>
      <select
        id="locationType"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">--Select--</option>
        <option value="In person">In person</option>
        <option value="Online">Online</option>
      </select>
      {errors.type && <p className="error">{errors.type}</p>}
      <label htmlFor="privacyType">Is this group private or public?</label>
      <select
        id="privacyType"
        value={isPrivate ? "1" : "0"} //
        onChange={(e) => setIsPrivate(e.target.value === "1")}
      >
        <option value="1">Private</option>
        <option value="0">Public</option>
      </select>
      {errors.private && <p className="error">{errors.private}</p>}
      <div>
        <label>Price:</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button type="submit">Create Event</button>
    </form>
  );
}

export default CreateEvent;
