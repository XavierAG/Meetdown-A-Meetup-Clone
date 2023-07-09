import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./EventInfo.css";

function EventInfo() {
  const { eventId } = useParams();
  const [event, setEvent] = useState([]);
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.Event) {
            setEvent(data.Event);
          }
        } else {
          throw new Error("Failed to fetch event data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-info">
      <div className="breadcrumb">
        &lt;<a href="/events">Events</a>
      </div>
      <div className="event-details">
        <h1>{event.name}</h1>
        <p>Hosted by: </p>
        <img src={event.url} alt="Event Image" />
        <div className="event-info-box">
          <div className="start-end-time">
            <span className="icon">Clock</span>
            <span>{event.startDate}</span>

            <span>{event.endDate}</span>
          </div>
          <div className="price">
            <span className="icon">Money</span>
            <span>{event.price === 0 ? "FREE" : `$${event.price}`}</span>
          </div>
          <div className="location">
            <span className="icon">Map Pin</span>
            <span>
              {event.city} {event.state}
            </span>
          </div>
          <h2>Description</h2>
          <p>{event.description}</p>
        </div>
        <div className="group-info-box">
          <h2>Group Info</h2>
          <p>Group: {event.name}</p>
          <p>Location: {event.location}</p>
          <p>Description: {event.about}</p>
        </div>
        {currentUser && currentUser.id === event.userId && (
          <div className="event-actions">
            <button className="update-button">Update</button>
            <button className="delete-button">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
export default EventInfo;
