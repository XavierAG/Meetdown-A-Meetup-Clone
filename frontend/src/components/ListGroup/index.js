import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./ListGroup.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchAllGroups } from "../../store/group";

function ListGroup() {
  const [activeLink, setActiveLink] = useState("");
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.group.allGroups);
  const history = useHistory();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  useEffect(() => {
    dispatch(fetchAllGroups());
  }, [dispatch]);

  if (!groups || Object.keys(groups).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="group-page">
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
      <h4>Groups in Meetdown</h4>
      {groups.Groups.map((group) => (
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
