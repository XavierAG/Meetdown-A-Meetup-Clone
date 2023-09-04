import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./ListEvent.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchAllEvents } from "../../store/event";

function ListEvent() {
  const [activeLink, setActiveLink] = useState("");
  const [event, setEvent] = useState([]);
  const dispatch = useDispatch();
  const events = useSelector((state) => state.event.allEvents);
  const history = useHistory();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events && events.Events) {
      const currentDate = new Date();
      const sortedEvents = events.Events.sort((a, b) => {
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
      setEvent(sortedEvents);
    }
  }, [events]);

  if (Object.keys(events).length === 0) {
    return <div>Loading...</div>;
  }

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
      {event.map((event) => {
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
                  {event.previewImage ? (
                    <img src={event.previewImage} alt="Event Preview" />
                  ) : (
                    <h3>No Preview Img!</h3>
                  )}
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
