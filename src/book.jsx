import React, { useState } from "react";
import "./styles.css";

function Book({ content, allBooks, handleSync }) {
  const matchedBooks = [];
  const [showHighlights, setShowHighlights] = useState(false);
  const [forSync, setForSync] = useState(false);

  allBooks.forEach((book) => {
    const hasMatch = content.data.momentsByHandleAndBookId.some(
      (moment) => moment.bookId === book.id
    );

    if (hasMatch) {
      matchedBooks.push(book);
    }
  });

  const handleMouseEnter = () => {
    setShowHighlights(true);
  };

  const handleMouseLeave = () => {
    setShowHighlights(false);
  };

  const handleSyncClick = (item) => {
    if (forSync === false) {
      setForSync(true);
    } else {
      setForSync(false);
    }
    handleSync(item);
  };

  return (
    <>
      {matchedBooks.map((item) => (
        <div className="bookContainer">
          <div className="bookCover">
            <img src={item.cover} />
          </div>
          <div className="bookInfo">
            <div className="titleAuthor">
              <p className="title">{item.title}</p>
              <p className="author">{item.authors[0].name}</p>
            </div>
            <div className="highlightsSync">
              <button
                className="highlightsButton"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {content.data.momentsByHandleAndBookId.length} highlights found
              </button>
              <button
                className="syncButton"
                onClick={() => handleSyncClick(item)}
              >
                {forSync ? "Unsync" : "Sync"}
              </button>
            </div>
            {showHighlights &&
              content.data.momentsByHandleAndBookId.map((item) => (
                <p className="highlight">{item.quote}</p>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default Book;
