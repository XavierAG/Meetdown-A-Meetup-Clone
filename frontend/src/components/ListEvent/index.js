import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./ListEvent.css";

function ListEvent() {
  const [activeLink, setActiveLink] = useState("");
  const [events, setEvents] = useState([]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data.Events);
        } else {
          throw new Error("Failed to fetch group data");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-page">
      <h1>Events in MeetDown</h1>
      <div className="group-event">
        <h2>
          <NavLink
            exact
            to="/events"
            activeClassName="active-link"
            onClick={() => handleLinkClick("/events")}
          >
            Events
          </NavLink>{" "}
          <NavLink
            exact
            to="/groups"
            activeClassName="active-link"
            onClick={() => handleLinkClick("/groups")}
          >
            Groups
          </NavLink>
        </h2>
      </div>
      {events.map((event) => (
        <div key={event.id} className="event-cards">
          <div className="left">
            <img src={event.previewImage} alt="event Preview" />
          </div>
          <div className="right">
            <p>{event.startDate}</p>
            <h2>{event.name}</h2>
            <p>{event.Group.name}</p>
            <p>
              {event.Venue.city}, {event.Venue.state}
            </p>
            <div> {event.numAttending} attendees</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListEvent;
