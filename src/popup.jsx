import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./styles.css";

import Credentials from "./credentials.jsx";
import SyncList from "./syncList.jsx";

function Popup() {
  const [userId, setUserId] = useState("");
  const [handle, setHandle] = useState("");
  const handleUserId = (userCredentials, handle) => {
    setUserId(userCredentials);
    setHandle(handle);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Credentials onCredentialsChange={handleUserId} />}
        />
        <Route
          path="/syncList"
          element={<SyncList userId={userId} handle={handle} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

render(<Popup />, document.getElementById("react-target")); //renders component inside the div with id 'react-target'
