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
              //TODO not displayed, fix later
              <svg
                width="40"
                height="60"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1703 478q40 57 18 129l-275 906q-19 64-76.5 107.5t-122.5 43.5h-923q-77 0-148.5-53.5t-99.5-131.5q-24-67-2-127 0-4 3-27t4-37q1-8-3-21.5t-3-19.5q2-11 8-21t16.5-23.5 16.5-23.5q23-38 45-91.5t30-91.5q3-10 .5-30t-.5-28q3-11 17-28t17-23q21-36 42-92t25-90q1-9-2.5-32t.5-28q4-13 22-30.5t22-22.5q19-26 42.5-84.5t27.5-96.5q1-8-3-25.5t-2-26.5q2-8 9-18t18-23 17-21q8-12 16.5-30.5t15-35 16-36 19.5-32 26.5-23.5 36-11.5 47.5 5.5l-1 3q38-9 51-9h761q74 0 114 56t18 130l-274 906q-36 119-71.5 153.5t-128.5 34.5h-869q-27 0-38 15-11 16-1 43 24 70 144 70h923q29 0 56-15.5t35-41.5l300-987q7-22 5-57 38 15 59 43zm-1064 2q-4 13 2 22.5t20 9.5h608q13 0 25.5-9.5t16.5-22.5l21-64q4-13-2-22.5t-20-9.5h-608q-13 0-25.5 9.5t-16.5 22.5zm-83 256q-4 13 2 22.5t20 9.5h608q13 0 25.5-9.5t16.5-22.5l21-64q4-13-2-22.5t-20-9.5h-608q-13 0-25.5 9.5t-16.5 22.5z" />
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
