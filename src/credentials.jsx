import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFetchLiteralUser from "./useFetchLiteralUser.jsx";
import "./styles.css";

function Credentials() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [handle, setHandle] = useState("");
  console.log(handle);

  const handleClick = () => {
    setHandle(inputRef.current.value);
    navigate("/syncList");
  };

  const user = useFetchLiteralUser(handle);
  console.log(user);

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
          ref={inputRef}
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
        <button onClick={handleClick}>Save & Continue</button>
        <p className="hint">A hint how data is stored will be displayed here</p>
      </div>
    </div>
  );
}

export default Credentials;
