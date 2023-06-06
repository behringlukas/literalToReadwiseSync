import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Book from "./book.jsx";
import useFetchBooks from "./useFetchLiteralData.jsx";
import axios from "axios";

function SyncList({ userId, handle, token }) {
  const highlights = useFetchBooks(userId, handle);
  const navigate = useNavigate();
  const [selectedBooks, setSelectedBooks] = useState([]);

  const handleSyncBook = (book) => {
    console.log(token);
    const updatedBooks = selectedBooks.map((selectedBook) => {
      if (selectedBook.book.id === book.book.id) {
        return { ...selectedBook, selected: !selectedBook.selected };
      }
      return selectedBook;
    });

    if (
      !updatedBooks.some(
        (selectedBook) => selectedBook.book.id === book.book.id
      )
    ) {
      updatedBooks.push({ ...book, selected: true });
    }

    setSelectedBooks(updatedBooks);
    console.log(selectedBooks);
  };

  useEffect(() => {
    console.log(selectedBooks);
  }, [selectedBooks]);

  const handleSubmit = async () => {
    const selectedHighlights = [];
    for (const book of selectedBooks) {
      const bookHighlights = book.moments.map((moment) => {
        if (book.book.cover == "") {
          book.book.cover = null;
        }
        if (moment.note == "") {
          moment.note = null;
        }
        return {
          text: moment.quote,
          title: book.book.title,
          author: book.book.authors[0].name,
          image_url: book.book.cover,
          source_url: "https://literal.club",
          source_type: "literal_to_readwise",
          category: "books",
          note: moment.note,
          location: moment.where,
          location_type: "page",
          highlighted_at: moment.createdAt,
        };
      });

      selectedHighlights.push(...bookHighlights);
    }

    try {
      const response = await axios.post(
        "https://readwise.io/api/v2/highlights/",
        {
          highlights: selectedHighlights,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
        }
      );
      console.log(response.data);
      console.log(token);
      setSelectedBooks((prevSelectedBooks) =>
        prevSelectedBooks.map((selectedBook) => ({
          ...selectedBook,
          selected: true,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

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
        {highlights?.highlights?.map((item) =>
          Object.hasOwn(item, "selected") == false ? (
            <Book
              key={item.data.momentsByHandleAndBookId[0].bookId}
              content={item}
              allBooks={highlights.allBooks}
              selectedBooks={selectedBooks}
              handleSync={handleSyncBook}
            />
          ) : null
        )}
      </div>
      <div className="syncedContainer">
        <label>Your finished & synced books </label>
        {highlights?.highlights?.map((item) =>
          Object.hasOwn(item, "selected") == true ? (
            <Book
              key={item.data.momentsByHandleAndBookId[0].bookId}
              content={item}
              allBooks={highlights.allBooks}
              selectedBooks={selectedBooks}
              handleSync={handleSyncBook}
            />
          ) : null
        )}
      </div>
      <div className="syncSubmit">
        {selectedBooks.length > 0 ? (
          <button onClick={handleSubmit}>
            Sync {selectedBooks.length} books to Readwise
          </button>
        ) : (
          <button disabled>Select books to sync</button>
        )}
      </div>
    </div>
  );
}

export default SyncList;
