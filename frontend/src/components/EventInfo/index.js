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

  if (Object.keys(event).length === 0 || Object.keys(group).length === 0) {
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
  const sDate = new Date(event.startDate);
  const eDate = new Date(event.startDate);
  const formatSDate = sDate.toISOString().split("T")[0];
  const formatSTime = sDate.toTimeString().split(" ")[0];
  const formatEDate = eDate.toISOString().split("T")[0];
  const formatETime = eDate.toTimeString().split(" ")[0];

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
            <div className="event-info-content">
              <span className="icon">
                <i class="fa-regular fa-clock"></i>
              </span>
              <div className="event-times">
                <span>
                  {"START"} &nbsp;
                  <span className="green-time">
                    {formatSDate} {" · "} {formatSTime}{" "}
                  </span>
                </span>
                <span>
                  {"END"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="green-time">
                    {formatEDate}
                    {" · "} {formatETime}
                  </span>
                </span>
              </div>
            </div>
            <div className="event-info-content between">
              <div>
                <span className="icon">
                  <i class="fa-solid fa-dollar-sign"></i>
                </span>
                <span>{event.price === 0 ? "FREE" : `${event.price}`}</span>
              </div>
            </div>
            <div className="event-info-content between">
              <div>
                <span className="icon">
                  <i class="fa-solid fa-map-pin"></i>
                  {event.type}
                </span>
              </div>
              <div className="group-buttons">{groupButtons}</div>
            </div>
          </div>
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
