import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./EventInfo.css";
import OpenModalButton from "../OpenModalButton";
import DeleteModal from "../DeleteModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchEvent } from "../../store/event";
import { fetchGroup } from "../../store/group";

function EventInfo() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.session.user);
  const event = useSelector((state) => state.event.singleEvent);
  const group = useSelector((state) => state.group.singleGroup);

  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    if (event) {
      dispatch(fetchGroup(event.groupId));
    }
  }, [dispatch, event]);

  if (!event || !group) {
    return <div>Loading...</div>;
  }

  let groupButtons;
  if (currentUser?.id === group?.Organizer.id) {
    groupButtons = (
      <div>
        <OpenModalButton
          buttonText="Delete"
          modalComponent={
            <DeleteModal deleteContext={{ type: "Event", eventId: eventId }} />
          }
        />
      </div>
    );
  }

  return (
    <div className="event-details">
      <div className="upper-event">
        <div className="breadcrumb">
          &lt;<a href="/events">Events</a>
        </div>
        <div>
          <h1>{event.name}</h1>
        </div>
        <div>
          <p>
            Hosted by {group.Organizer.firstName} {group.Organizer.lastName}
          </p>
        </div>
      </div>
      <div className="middle-event">
        <div className="left-event">
          <img src={event.EventImages[0].url} alt="Event Preview"></img>
        </div>
        <div className="right-event">
          <a
            className="group-of-event"
            onClick={() => history.push(`/groups/${group.id}`)}
          >
            <div className="group-info-box">
              <div className="left">
                <img src={group.GroupImages[0].url} alt="Group Preview" />
              </div>
              <div className="right">
                <p className="group-name-p">{event.Group.name}</p>
                <p className="gray">{group.private ? "Private" : "Public"}</p>
              </div>
            </div>
          </a>
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
              <span className="icon">Map Pin{event.type}</span>
            </div>
          </div>
          <div className="group-buttons">{groupButtons}</div>
        </div>
      </div>
      <div className="bottom-event">
        <h2>Details</h2>
        <p>{event.description}</p>
      </div>
    </div>
  );
}
export default EventInfo;
