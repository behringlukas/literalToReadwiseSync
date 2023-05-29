import React from "react";
import "./styles.css";

function Book({ content, allBooks }) {
  const matchedBooks = [];

  allBooks.forEach((book) => {
    const hasMatch = content.data.momentsByHandleAndBookId.some(
      (moment) => moment.bookId === book.id
    );

    if (hasMatch) {
      matchedBooks.push(book);
    }
  });

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
              <button className="highlightsButton">
                {content.data.momentsByHandleAndBookId.length} highlights found
              </button>
              {
                /*content.data.momentsByHandleAndBookId.map(
            (item) =>
              //<p>{item.quote}</p>
          )*/
                console.log(allBooks)
              }
              <button className="syncButton">Sync</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Book;
