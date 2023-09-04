import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createGroup } from "../../store/group";
import { addGroupImage } from "../../store/group";
import "./CreateGroup.css";
import { createVenue } from "../../store/venue";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function CreateGroup() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (url.trim() && !isValidUrl(url)) {
      validationErrors.url = "Invalid URL format";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const groupPayload = {
      organizerId: sessionUser.id,
      name,
      about,
      type,
      private: isPrivate,
      city,
      state,
    };
    try {
      const response = await dispatch(createGroup(groupPayload));

      if (response) {
        const newGroup = response;
        if (newGroup.errors) {
          setErrors(newGroup.errors);
          return;
        }
        if (newGroup) {
          const imagePayload = {
            groupId: newGroup.group.id,
            url,
            preview: true,
          };
          console.log(newGroup.group.id);
          dispatch(createVenue(newGroup.group.id));
          const newImage = await dispatch(addGroupImage(imagePayload));
          if (newImage) {
            history.push(`/groups/${newGroup.group.id}`);
          }
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  function isValidUrl(url) {
    const urlPattern =
      /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    return urlPattern.test(url);
  }

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
            to add to it later, too.
            <br />
            <br />
            1. What's the purpose of the group?
            <br /> 2. Who should join?
            <br /> 3. What will you do at your events?
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
          <p className="p-create">Is this an in-person or online group?</p>
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
          <p className="p-create">Is this group private or public?</p>
          <select
            id="privacyType"
            value={isPrivate} //
            onChange={(e) => setIsPrivate(e.target.value)}
          >
            <option value="">--Select--</option>
            <option value="1">Private</option>
            <option value="0">Public</option>
          </select>
          {errors.private && <p className="error">{errors.private}</p>}
          <p className="p-create">
            Please add in image url for your groub below:
          </p>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Image URL"
            required
          />
          {errors.url && <p className="error">{errors.url}</p>}
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
