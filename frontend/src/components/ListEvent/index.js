import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./ListEvent.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ListEvent() {
  const [activeLink, setActiveLink] = useState("");
  const [events, setEvents] = useState([]);
  const history = useHistory();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          const currentDate = new Date();
          const sortedEvents = data.Events.sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);

            if (dateA < currentDate && dateB < currentDate) {
              return dateA - dateB;
            } else if (dateA < currentDate) {
              return 1; // Move event A to the bottom
            } else if (dateB < currentDate) {
              return -1; // Move event B to the bottom
            } else {
              return dateA - dateB;
            }
          });
          setEvents(sortedEvents);
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
      <div className="group-event">
        <h1>
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
        </h1>
      </div>
      <h4>Events in Meetdown</h4>
      {events.map((event) => {
        const startDate = new Date(event.startDate);
        const formattedDate = startDate.toISOString().split("T")[0];
        const formattedTime = startDate.toTimeString().split(" ")[0];
        return (
          <a
            className="groups-listed"
            onClick={() => history.push(`/events/${event.id}`)}
          >
            <div key={event.id} className="event-cards">
              <div className="top-event-card">
                <div className="left">
                  <img src={event.previewImage} alt="Event Preview"></img>
                </div>
                <div className="right">
                  <h4>
                    {formattedDate} · {formattedTime}
                  </h4>
                  <h3>{event.name}</h3>
                  <p>
                    {event.Venue.city}, {event.Venue.state}
                  </p>
                </div>
              </div>
              <div className="lower-event-card">
                <p className="event-description">{event.description}</p>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default ListEvent;
