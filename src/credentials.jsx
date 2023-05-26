import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function Credentials({ onCredentialsChange }) {
  const navigate = useNavigate();
  const [handle, setHandle] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //can be deleted later
  useEffect(() => {
    onCredentialsChange(user, handle);
  }, [user]);

  const handleSave = () => {
    setLoading(true);
    axios
      .post("https://literal.club/graphql/", {
        query:
          "query getProfileParts($handle: String!) {profile(where: { handle: $handle }) {\n  id   handle  name   bio  image   invitedByProfileId }}",
        variables: {
          handle: handle,
        },
      })
      .then((response) => {
        setUser(response.data.data.profile.id);
        navigate("/syncList");
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Check if data is available and has at least one item
  // const quote = data?.momentsByHandleAndBookId?.[0]?.quote || "";

  return (
    <div className="popup">
      <div>
        <h1>Let's get started by securily connecting your accounts.</h1>
      </div>
      <div className="syncFrom">
        <label>Sync books from</label>
        <input
          type="text"
          name="lithandle"
          placeholder="Enter your Literal handle"
          onChange={(e) => setHandle(e.target.value)}
        />
      </div>
      <div className="syncTo">
        <div className="toAndLink">
          <label>to</label>
          {/*target needed to open link in new tab, will cause the popup to close*/}
          <a href="https://readwise.io/access_token" target="_blank">
            Click here and login to get your token
          </a>
        </div>
        <input
          type="password"
          name="readwisetoken"
          placeholder="Paste your Readwise access token"
        />
      </div>
      <div>
        <button onClick={handleSave}>Save & Continue</button>
        <p className="hint">A hint how data is stored will be displayed here</p>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error!</p>}
      {user && <p>User: </p>}
    </div>
  );
}

export default Credentials;
