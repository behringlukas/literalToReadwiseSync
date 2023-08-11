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
  const [token, setToken] = useState("");
  const [storageHandle, setStorageHandle] = useState(false);
  const [storageToken, setStorageToken] = useState(false);

  useEffect(() => {
    onCredentialsChange(user, handle, token);
  }, [user, handle, token]);

  useEffect(() => {
    chrome.storage.sync.get(["handle", "token"], (res) => {
      if (res.handle != undefined) {
        setHandle(res.handle);
        setStorageHandle(true);
      }
      if (res.token != undefined) {
        setToken(res.token);
        setStorageToken(true);
      }
    });
  }, []);

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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSave();
    }
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
          onKeyDown={handleKeyPress}
          onChange={(e) => setHandle(e.target.value)}
          value={storageHandle ? handle : undefined}
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
          onKeyDown={handleKeyPress}
          onChange={(e) => setToken(e.target.value)}
          value={storageToken ? token : undefined}
        />
      </div>
      <div>
        {token.length > 0 && handle.length > 0 ? (
          <button onClick={handleSave} onKeyDown={handleKeyPress}>
            Save & Continue
          </button>
        ) : (
          <button disabled>Please provide a handle and token first</button>
        )}
        <p className="hint">A hint how data is stored will be displayed here</p>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error!</p>}
      {user && <p>User: </p>}
    </div>
  );
}

export default Credentials;
