import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./GroupInfo.css";

function GroupInfo() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [event, setEvent] = useState([]);
  const currentUser = useSelector((state) => state.session.user);
  const [orgbutton, setOrgButton] = useState("hidden");
  const [joinbutton, setJoinButton] = useState("hidden");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.Groups && data.Groups.length > 0) {
            setGroup(data.Groups[0]);
          }
        } else {
          throw new Error("Failed to fetch group data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchGroup();
  }, [groupId]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          if (data && data.Events) {
            setEvent(data.Events);
          }
        } else {
          throw new Error("Failed to fetch events data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);
  useEffect(() => {
    if (currentUser) {
      if (currentUser.id === group.Organizer.id) {
        setOrgButton("show");
        setJoinButton("hidden");
      } else {
        setOrgButton("hidden");
        setJoinButton("show");
      }
    } else {
      setOrgButton("hidden");
      setJoinButton("hidden");
    }
  }, [currentUser, group]);

  if (!group) {
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
              <img src={group.image} alt="Group Image" />
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
              <div className="group-buttons">
                <button
                  className={`join-button ${joinbutton}`}
                  onClick={() => alert("Feature coming soon")}
                >
                  Join the group
                </button>
                <button className={`org-button ${orgbutton}`}>
                  Create Event
                </button>
                <button className={`org-button ${orgbutton}`}>Update</button>
                <button className={`org-button ${orgbutton}`}>Delete</button>
              </div>
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
              .map((event) => (
                <a
                  className="event-card"
                  href={"/events/" + event.id}
                  key={event.id}
                >
                  <div className="top-event-card">
                    <div className="left">
                      <img src={event.previewImage} alt="Event Preview"></img>
                    </div>
                    <div className="right">
                      <h4>{event.startDate}</h4>
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
              ))}
        </div>
      </div>
    </>
  );
}
export default GroupInfo;
