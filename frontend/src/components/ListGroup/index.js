import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./ListGroup.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ListGroup() {
  const [activeLink, setActiveLink] = useState("");
  const [groups, setGroups] = useState([]);
  const history = useHistory();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/groups");
        if (response.ok) {
          const data = await response.json();
          setGroups(data.Groups);
        } else {
          throw new Error("Failed to fetch group data");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="group-page">
      <h1>Groups in MeetDown</h1>
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
      {groups.map((group) => (
        <a
          className="groups-listed"
          onClick={() => history.push(`/groups/${group.id}`)}
        >
          <div key={group.id} className="group-card">
            <div className="left">
              {group.previewImage ? (
                <img src={group.previewImage} alt="Group Preview" />
              ) : (
                <h3>No Preview Img!</h3>
              )}
            </div>
            <div className="right">
              <h3>{group.name}</h3>
              <h2>
                {group.city}, {group.state}
              </h2>
              <p>{group.about}</p>
              <div className="member-private">
                {group.numMembers} members ·{" "}
                {group.private ? "private" : "public"}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default ListGroup;
