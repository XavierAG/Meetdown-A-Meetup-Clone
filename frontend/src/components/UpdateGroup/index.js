import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addGroupImage } from "../../store/group";
import "./UpdateGroup.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { editGroup } from "../../store/group";

function UpdateGroup() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({});
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      organizerId: sessionUser.id,
      name,
      about,
      type,
      private: isPrivate,
      city,
      state,
    };
    try {
      const response = await dispatch(editGroup(groupId, payload));
      if (response) {
        const editedGroup = response;
        if (editedGroup.errors) {
          setErrors(editedGroup.errors);
          return;
        }
        if (editedGroup) {
          history.push(`/groups/${editedGroup.id}`);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.Groups && data.Groups.length > 0) {
            const oldGroup = data.Groups[0];
            setGroup(oldGroup);
            setName(oldGroup.name);
            setAbout(oldGroup.about);
            setType(oldGroup.type);
            setIsPrivate(oldGroup.private);
            setCity(oldGroup.city);
            setState(oldGroup.state);
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
  return (
    <div className="update-group-page">
      <h3>Edit Group</h3>
      <h2>We'll walk you through a few steps to build your local community</h2>
      <form className="form" onSubmit={handleSubmit}>
        {" "}
        <div className="section">
          <h2>First, set your group's location</h2>
          <p className="p-update">
            Meetup groups meet locally, in person, and online. We'll connect you
            with people in your area.
          </p>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {errors.city && <p className="error">{errors.city}</p>}
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>
        <div className="section">
          <h2>What will your group's name be?</h2>
          <p className="p-update">
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </p>
          <input
            type="text"
            placeholder="What is your group name?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="section">
          <h2>Describe the purpose of your group.</h2>
          <p className="p-update">
            People will see this when we promote your group, but you'll be able
            to add to it later, too. 1. What's the purpose of the group? 2. Who
            should join? 3. What will you do at your events?
          </p>
          <textarea
            className="about-text-area"
            placeholder="Please write at least 30 characters"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          {errors.about && <p className="error">{errors.about}</p>}
        </div>
        <div className="section">
          <h2>Final steps...</h2>
          <label htmlFor="select">Is this an in-person or online group?</label>
          <select
            id="locationType"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          {errors.type && <p className="error">{errors.type}</p>}
          <label htmlFor="privacyType">Is this group private or public?</label>
          <select
            id="privacyType"
            value={isPrivate ? "1" : "0"} //
            onChange={(e) => setIsPrivate(e.target.value === "1")}
          >
            <option value="1">Private</option>
            <option value="0">Public</option>
          </select>
          {errors.private && <p className="error">{errors.private}</p>}
        </div>
        <div className="section">
          <button className="update-group-button" type="submit">
            Update Group
          </button>
        </div>
      </form>
    </div>
  );
}
export default UpdateGroup;
