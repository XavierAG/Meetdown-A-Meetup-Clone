import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../store/event";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { addEventImage } from "../../store/event";
import { fetchGroup } from "../../store/group";
import "./CreateEvent.css";

function CreateEvent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  // const [startT, setStartT] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [endT, setEndT] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [url, setUrl] = useState("");
  const { groupId } = useParams();
  const group = useSelector((state) => state.group.singleGroup);

  useEffect(() => {
    dispatch(fetchGroup(groupId));
  }, [dispatch, groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (url.trim() && !isValidUrl(url)) {
      validationErrors.url = "Invalid URL format";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const priceAsFloat = parseFloat(price);

    const payload = {
      venueId: group.Venues[0].id,
      groupId: group.id,
      name,
      description,
      type,
      private: isPrivate,
      capacity: 100,
      price: priceAsFloat,
      startDate,
      endDate,
    };

    try {
      const response = await dispatch(createEvent(group.id, payload));

      if (response) {
        console.log("RESPONSE", response);
        const newEvent = response;
        if (newEvent.errors) {
          setErrors(newEvent.errors);
          return;
        }
        if (newEvent) {
          const imagePayload = {
            eventId: newEvent.event.id,
            url,
            preview: true,
          };
          const newImage = await dispatch(addEventImage(imagePayload));
          if (newImage) {
            history.push(`/events/${newEvent.event.id}`);
          }
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  function isValidUrl(url) {
    const urlPattern =
      /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    return urlPattern.test(url);
  }

  return (
    <div className="create-event-page">
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Create an event for {group.name}</h2>
          <div className="event-section">
            <p className="p-create">What is the name of your event?</p>
            <input
              placeholder="Event Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
        </div>
        <div className="event-section">
          <p className="p-create">Is this an in-person or online event?</p>
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
        </div>
        <div className="event-section">
          <p className="p-create">Is this event private or public?</p>
          <select
            id="privacyType"
            value={isPrivate} //
            onChange={(e) => setIsPrivate(e.target.value)}
          >
            <option value="">--Select--</option>
            <option value="1">Private</option>
            <option value="0">Public</option>
          </select>
          {errors.private && <p className="error">{errors.private}</p>}
        </div>

        <div className="event-section">
          <p className="p-create">What is the price for your event?</p>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
        <div className="event-section">
          <p className="p-create">When does your event start?</p>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          {/* <input
          type="time"
          value={startT}
          onChange={(e) => setStartT(e.target.value)}
        /> */}
          {errors.startDate && <p className="error">{errors.startDate}</p>}
        </div>
        <div className="event-section">
          <p className="p-create">When does your event end?</p>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          {/* <input
          type="time"
          value={endT}
          onChange={(e) => setEndT(e.target.value)}
        /> */}
          {errors.endDate && <p className="error">{errors.endDate}</p>}
        </div>
        <div className="event-section">
          <p className="p-create">
            Please add in imaage url for your event below
          </p>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Image URL"
            required
          />
          {errors.url && <p className="error">{errors.url}</p>}
        </div>
        <div>
          <p className="p-create">Please describe your event</p>
          <textarea
            className="event-textarea"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
