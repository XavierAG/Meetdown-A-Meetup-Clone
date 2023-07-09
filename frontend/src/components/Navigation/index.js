import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../assets/images/meetdown-logo.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [createButton, setCreateButton] = useState("hidden");

  useEffect(() => {
    if (sessionUser) {
      setCreateButton("show");
    } else {
      setCreateButton("hidden");
    }
  }, [sessionUser]);
  return (
    <ul>
      <li>
        <NavLink exact to="/">
          <img className="logo-home" src={logo} alt="logo"></img>
        </NavLink>
      </li>
      {isLoaded && (
        <li className="right-nav">
          <a className={createButton} href="/create-group">
            Start a new group
          </a>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
