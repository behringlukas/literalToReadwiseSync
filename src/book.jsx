import React, { useState } from "react";
import "./styles.css";

function Book({ content, allBooks, handleSync }) {
  const matchedBooks = [];
  const [showHighlights, setShowHighlights] = useState(false);
  const [forSync, setForSync] = useState(false);
  const [flip, setFlipped] = useState(false);

  allBooks.forEach((book) => {
    const validMoments = content.data.momentsByHandleAndBookId.filter(
      (moment) =>
        moment.bookId === book.id && moment.quote && moment.quote.trim() !== ""
    );

    if (validMoments.length) {
      matchedBooks.push({
        book: book,
        moments: validMoments,
      });
    }
  });

  const handleHighlightsClick = () => {
    setShowHighlights(!showHighlights);
    setFlipped(!flip);
  };

  const handleSyncClick = (item) => {
    if (forSync === false) {
      setForSync(true);
    } else {
      setForSync(false);
    }
    handleSync(item);
  };
  //TODO books that are audiobooks are not displayed???
  return (
    <>
      {matchedBooks.map((item) => (
        <div className="bookContainer">
          <div className="bookCover">
            {item.book.cover !== "" ? (
              <img src={item.book.cover} />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="227.2 212.535 57.6 86.84"
                width="88%"
              >
                <path
                  d="M 277.85 228.675 V 219.325 c 0 -2.15 -0.85 -4.15 -2.35 -5.4 c -1.35 -1.15 -3.15 -1.6 -5 -1.3 L 234.05 219.275 l -0.05 0 c -5 1.15 -6.8 5.2 -6.8 8.65 v 7.7 v 3.85 v 3.5 v 4.85 c 0 0.2 0 0.35 0 0.55 v 44.35 c 0 0.1 0 0.2 0 0.3 v 0.35 c 0 3.3 2.7 6 6 6 h 44.25 c 3.95 0 7.35 -3.2 7.35 -7 v -7.6 v -3.85 v -3.45 v -26.9 v -7.6 v -3.5 v -3.85 C 284.8 231.975 281.65 228.875 277.85 228.675 z M 231.85 292.975 L 231.85 292.975 c -0.05 1.05 -0.25 2.1 -0.4 2.9 c 0 0 0 0 0 0 c 0 0.05 -0.05 0.15 -0.05 0.2 c -0.05 -0.05 -0.1 -0.05 -0.15 -0.1 c 0 0 -0.05 -0.05 -0.05 -0.05 c 0 0 -0.05 -0.05 -0.05 -0.05 c -0.05 0 -0.05 -0.05 -0.1 -0.1 c 0 0 -0.05 -0.05 -0.05 -0.05 c -0.05 -0.05 -0.05 -0.05 -0.1 -0.1 l 0 0 c -0.6 -0.7 -1.05 -1.8 -1.05 -3 v -0.65 c 0 -1.1 0.35 -2.1 0.85 -2.8 l 0 0 c 0.05 -0.05 0.1 -0.15 0.15 -0.2 c 0 0 0 0 0 0 c 0.05 -0.05 0.1 -0.1 0.15 -0.15 c 0 0 0 0 0 0 c 0.05 -0.05 0.1 -0.1 0.15 -0.15 c 0 0 0 0 0.05 -0.05 c 0.05 -0.05 0.1 -0.1 0.15 -0.1 c 0 0.1 0.05 0.2 0.05 0.3 c 0 0 0 0 0 0.05 c 0.15 0.8 0.35 1.9 0.4 3 v 0 c 0 0.2 0 0.35 0 0.55 C 231.85 292.575 231.85 292.775 231.85 292.975 z M 277.45 296.775 H 234 c 0.05 -0.2 0.1 -0.35 0.1 -0.55 c 0.05 -0.15 0.05 -0.35 0.1 -0.6 h 43.2 c 1.6 0 3.05 -0.45 4.2 -1.3 C 280.85 295.725 279.25 296.775 277.45 296.775 z M 234.55 291.825 h 42.95 c 1.4 0 2.7 -0.4 3.8 -1.05 c -0.7 1.3 -1.95 2.2 -3.8 2.2 H 234.55 c 0 -0.2 0 -0.4 0 -0.6 C 234.55 292.175 234.55 291.975 234.55 291.825 z M 277.45 289.125 H 234.25 c -0.05 -0.3 -0.1 -0.5 -0.15 -0.7 c -0.05 -0.2 -0.05 -0.35 -0.1 -0.5 h 43.45 c 1.55 0 3 -0.5 4.2 -1.3 C 280.9 288.075 279.25 289.125 277.45 289.125 z M 282.15 277.525 L 282.15 277.525 l 0 3.8 c -0.2 2.1 -2.3 3.9 -4.65 3.9 h -34.55 c 8.4 -1.5 20.45 -3.6 28.05 -4.95 c 3.8 -0.65 6.85 -4.55 6.85 -8.7 v -40.25 c 2.35 0.2 4.3 2.1 4.3 4.3 V 277.525 z"
                  fill="#000000"
                />
              </svg>
            )}
          </div>
          <div className="bookInfo">
            <div className="titleAuthor">
              <p className="title">{item.book.title}</p>
              <p className="author">{item.book.authors[0].name}</p>
            </div>
            <div className="highlightsSync">
              <button
                className="highlightsButton"
                onClick={handleHighlightsClick}
              >
                {
                  content.data.momentsByHandleAndBookId.filter(
                    (moment) => moment.quote && moment.quote.trim() !== ""
                  ).length
                }{" "}
                highlights found
                <div className="highlightsArrow">
                  <span
                    className="chevron"
                    style={{
                      transform: showHighlights
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    &#x276F;
                  </span>
                </div>
              </button>
              <button
                className={`syncButton ${forSync ? "syncButtonUnsync" : ""}`}
                onClick={() => handleSyncClick(item)}
              >
                {forSync ? "Unsync" : "Sync"}
              </button>
            </div>
            {showHighlights &&
              content.data.momentsByHandleAndBookId
                .filter((moment) => moment.quote && moment.quote.trim() !== "")
                .map((item) => (
                  <p className="highlight">
                    {item.quote}
                    <div className="separator"></div>
                  </p>
                ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default Book;
