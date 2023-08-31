import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import ListGroup from "./components/ListGroup";
import ListEvent from "./components/ListEvent";
import CreateGroup from "./components/CreateGroup";
import GroupInfo from "./components/GroupInfo";
import EventInfo from "./components/EventInfo";
import UpdateGroup from "./components/UpdateGroup";
import CreateEvent from "./components/CreateEvent";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/groups">
          <ListGroup />
        </Route>
        <Route exact path="/events">
          <ListEvent />
        </Route>
        <Route exact path="/groups/:groupId?/update-group">
          <UpdateGroup />
        </Route>
        <Route exact path="/create-group">
          <CreateGroup />
        </Route>
        <Route exact path="/groups/:groupId?/events/new">
          <CreateEvent />
        </Route>
        <Route exact path="/groups/:groupId?">
          <GroupInfo />
        </Route>
        <Route exact path="/events/:eventId?">
          <EventInfo />
        </Route>
      </Switch>
    </>
  );
}

export default App;
