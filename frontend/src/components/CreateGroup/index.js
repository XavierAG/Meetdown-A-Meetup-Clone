import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createGroup } from "../../store/group";
import "./CreateGroup.css";

function CreateGroup() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [name, setName] = useState("");
  const history = useHistory();
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sessionUser) {
      setErrors({});
      return dispatch(
        createGroup({
          organizerId: sessionUser.id,
          name,
          about,
          type,
          isPrivate,
          city,
          state,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }
  };
  return (
    <div className="create-group-page">
      <h3>Start a New Group</h3>
      <h2>We'll walk you through a few steps to build your local community</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="section">
          <h2>First, set your group's location</h2>
          <p className="p-create">
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
          <p className="p-create">
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
          <p className="p-create">
            People will see this when we promote your group, but you'll be able
            to add to it later, too. 1. What's the purpose of the group? 2. Who
            should join? 3. What will you do at your events?
          </p>
          <textarea
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
            <option value="">--Select--</option>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          {errors.type && <p className="error">{errors.type}</p>}
          <label htmlFor="privacyType">Is this group private or public?</label>
          <select
            id="privacyType"
            value={isPrivate} //
            onChange={(e) => setIsPrivate(e.target.value)}
          >
            <option value="true">Private</option>
            <option value="">Public</option>
          </select>
          {errors.private && <p className="error">{errors.private}</p>}
        </div>
        <div className="section">
          <button className="create-group-button" type="submit">
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
}
export default CreateGroup;

//1024px
