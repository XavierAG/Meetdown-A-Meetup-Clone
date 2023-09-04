import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./GroupInfo.css";
import OpenModalButton from "../OpenModalButton";
import DeleteModal from "../DeleteModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchGroup } from "../../store/group";
import { fetchAllEvents } from "../../store/event";

function GroupInfo() {
  const { groupId } = useParams();
  const [event, setEvent] = useState([]);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.group.singleGroup);
  const events = useSelector((state) => state.event.allEvents);
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchGroup(groupId));
    dispatch(fetchAllEvents());
  }, [dispatch, groupId]);

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

  let groupButtons;
  if (currentUser?.id === group?.organizerId) {
    groupButtons = (
      <div>
        <button onClick={() => history.push(`/groups/${groupId}/events/new`)}>
          Create Event
        </button>
        <button onClick={() => history.push(`/groups/${groupId}/update-group`)}>
          Update
        </button>
        <OpenModalButton
          buttonText="Delete"
          modalComponent={
            <DeleteModal deleteContext={{ type: "Group", groupId: groupId }} />
          }
        />
      </div>
    );
  } else if (currentUser) {
    groupButtons = (
      <button onClick={() => alert("Feature coming soon")}>
        Join the group
      </button>
    );
  }

  if (Object.keys(group).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="group-info">
        <div className="breadcrumb">
          &lt;<a href="/groups">Groups</a>
        </div>
        <div className="upper">
          <div className="upper-group">
            <div className="left">
              <img src={group.GroupImages[0].url} alt="Group Preview" />
            </div>
            <div className="right">
              <h1>{group.name}</h1>
              <p>
                {group.city}, {group.state}
              </p>
              <p>
                {event && event.filter((e) => e.groupId === group.id).length}{" "}
                events · {group.type}
              </p>
              <p>
                Organized by {group.Organizer.firstName}{" "}
                {group.Organizer.lastName}
              </p>
              <div className="group-buttons">{groupButtons}</div>
            </div>
          </div>
        </div>
        <div className="grp-description">
          <h2>Organizer</h2>
          <p className="org">
            {group.Organizer.firstName} {group.Organizer.lastName}
          </p>
          <h2>What we're about</h2>
          <p>{group.about}</p>
        </div>
        <div className="events-group">
          <h2>
            Upcoming Events &#40;
            {event && event.filter((e) => e.groupId === group.id).length}&#41;
          </h2>
          {event &&
            event
              .filter((event) => event.groupId === group.id)
              .map((event) => {
                const startDate = new Date(event.startDate);
                const formattedDate = startDate.toISOString().split("T")[0];
                const formattedTime = startDate.toTimeString().split(" ")[0];
                return (
                  <a
                    className="event-card"
                    href={"/events/" + event.id}
                    key={event.id}
                  >
                    <div className="top-event-card">
                      <div className="left">
                        {event.previewImage ? (
                          <img src={event.previewImage} alt="Group Preview" />
                        ) : (
                          <h3 className="no-preview">No Preview Img!</h3>
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
                  </a>
                );
              })}
        </div>
      </div>
    </>
  );
}
export default GroupInfo;
