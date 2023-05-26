import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Book from "./book.jsx";
import useFetchBooks from "./useFetchLiteralData.jsx";

function SyncList({ userId, handle }) {
  const highlights = useFetchBooks(userId, handle);
  console.log(highlights);
  const navigate = useNavigate();

  return (
    <div className="popup">
      <div className="toolbar">
        <label>Change credentials</label>
        <button className="iconButton" onClick={() => navigate("/credentials")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9" />
          </svg>
        </button>
      </div>
      <div className="unsyncedContainer">
        <label>Your finished & unsynced books </label>
        <Book />
      </div>
      <div className="syncedContainer">
        <label>Your finished & synced books </label>
        <Book />
      </div>
    </div>
  );
}

export default SyncList;
