import React from "react";
import "./styles.css";
import Book from "./book.jsx";
import useFetchLiteralData from "./useFetchLiteralData.jsx";

function SyncList() {
  const { data, loading, error } = useFetchLiteralData();

  console.log(data);
  return (
    <div className="popup">
      <div className="toolbar">
        <label>Change credentials</label>
        <button className="iconButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
