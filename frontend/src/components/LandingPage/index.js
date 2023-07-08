import React from "react";
import "./LandingPage.css";
import infographic from "../../assets/images/infographic.png";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="section1">
        <div className="left">
          <h1>
            A people platform -- meet new people with similar hobbies and
            interests
          </h1>
          <p>
            Whatever your interest, from hiking and reading to networking and
            skill sharing, there are thousands of people who share it on Meetup.
            Events are happening every day—sign up to join the fun.
          </p>
        </div>
        <div className="right">
          <img src={infographic} alt="Infographic" />
        </div>
      </div>
      <div className="section2">
        <h2>How MeetupDown works</h2>
        <p>
          Meet new people who share similar interests through online and in-
          person events. Its free to create an account
        </p>
      </div>
      <div className="section3">
        <div className="column">
          <i class="fa-solid fa-handshake"></i>
          <a href="/groups" className="link">
            <h3>Join a group</h3>
          </a>
          <p>
            Do what you love and meet others who love it, find your community.
          </p>
        </div>
        <div className="column">
          <i class="fa-solid fa-magnifying-glass"></i>
          <a href="/events" className="link">
            <h3>Find an event</h3>
          </a>
          <p>
            Events are happening all around you on just about any topic. Find an
            event near you!
          </p>
        </div>
        <div className="column">
          <i class="fa-solid fa-users-line"></i>
          <a href="/create-group" className="link">
            <h3>Start a group</h3>
          </a>
          <p>No group near you? Make one then!</p>
        </div>
      </div>
      <div className="section4">
        <OpenModalButton
          buttonText="Join Meetup"
          modalComponent={<SignupFormModal />}
        />
      </div>
    </div>
  );
}

export default LandingPage;
