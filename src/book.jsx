import React from "react";
import "./styles.css";

function Book() {
  return (
    <div className="bookContainer">
      <div className="bookCover">img</div>
      <div className="bookInfo">
        <div className="titleAuthor">
          <p className="title">Klara and the Sun</p>
          <p className="author">Kazuo Ishiguro</p>
        </div>
        <div className="highlightsSync">
          <button className="highlightsButton">Highlights</button>
          <button className="syncButton">Sync</button>
        </div>
      </div>
    </div>
  );
}

export default Book;
