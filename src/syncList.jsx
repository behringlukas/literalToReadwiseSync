import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Book from "./book.jsx";
import useFetchBooks from "./useFetchLiteralData.jsx";
import axios from "axios";

function SyncList({ userId, handle, token }) {
  const highlights = useFetchBooks(userId, handle);
  console.log("highlights value:", highlights);
  console.log(highlights);
  const navigate = useNavigate();
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [syncedBefore, setSyncedBefore] = useState([]);
  console.log("syncedBefore state:", syncedBefore);

  const handleSyncBook = (book) => {
    setSelectedBooks((prevSelectedBooks) => {
      const bookIndex = prevSelectedBooks.findIndex(
        (selectedBook) => selectedBook.book.id === book.book.id
      );

      if (bookIndex !== -1) {
        console.log("prevSelectedBooks:", prevSelectedBooks);
        const updatedBooks = [...prevSelectedBooks];
        updatedBooks.splice(bookIndex, 1);
        return updatedBooks;
      } else {
        const updatedBooks = { ...book, selected: true };
        return [...prevSelectedBooks, updatedBooks];
      }
    });
  };

  useEffect(() => {
    chrome.storage.sync.set({ handle, token }, () => {});
    chrome.storage.sync.get(["syncedBefore"], (res) => {
      if (res.syncedBefore != undefined) {
        console.log("res.syncedBefore:", res.syncedBefore);
        setSyncedBefore(res.syncedBefore);
      }
    });
  }, []);

  useEffect(() => {
    console.log(selectedBooks);
  }, []);

  const handleSubmit = async () => {
    try {
      const selectedHighlights = selectedBooks
        .map((book) => {
          return book.moments.map((moment) => {
            const cover = book.book.cover === "" ? null : book.book.cover;
            const note = moment.note === "" ? null : moment.note;
            return {
              text: moment.quote,
              title: book.book.title,
              author: book.book.authors[0].name,
              image_url: cover,
              source_url: "https://literal.club",
              source_type: "literal_to_readwise",
              category: "books",
              note: note,
              location: moment.where,
              location_type: "page",
              highlighted_at: moment.createdAt,
            };
          });
        })
        .flat();

      const response = await axios.post(
        "https://readwise.io/api/v2/highlights/",
        { highlights: selectedHighlights },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
        }
      );

      console.log(response.data);
      console.log(token);

      const updatedSelectedBooks = selectedBooks.map((book) => ({
        ...book,
        selected: true,
      }));
      setSelectedBooks(updatedSelectedBooks);

      const updatedSyncedBefore = [...syncedBefore, ...updatedSelectedBooks];
      setSyncedBefore(updatedSyncedBefore);

      chrome.storage.sync.set({ syncedBefore: updatedSyncedBefore }, () => {
        if (chrome.runtime.lastError) {
          console.error("Storage error:", chrome.runtime.lastError);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUncommonBooks = () => {
    if (syncedBefore != undefined && syncedBefore != null) {
      const syncedBookIds = syncedBefore.map((book) => book.book.id);
      const uncommonBooks = highlights?.highlights?.filter((highlight) => {
        const bookId = highlight.data.momentsByHandleAndBookId[0].bookId;
        return !syncedBookIds.includes(bookId);
      });
      return uncommonBooks;
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
      <label>Your finished & unsynced books </label>
      <div className="unsyncedContainer">
        {getUncommonBooks()
          ? getUncommonBooks()?.map((item) => (
              <Book
                key={item.data.momentsByHandleAndBookId[0].bookId}
                content={item}
                allBooks={highlights?.allBooks}
                selectedBooks={selectedBooks}
                handleSync={handleSyncBook}
              />
            ))
          : highlights?.highlights?.map((item) => (
              <Book
                key={item.data.momentsByHandleAndBookId[0].bookId}
                content={item}
                allBooks={highlights?.allBooks}
                selectedBooks={selectedBooks}
                handleSync={handleSyncBook}
              />
            ))}
      </div>
      <label>Your finished & synced books </label>
      <div className="syncedContainer">
        {syncedBefore && highlights && highlights.highlights
          ? highlights?.highlights?.map((item) => {
              const bookId = item.data.momentsByHandleAndBookId[0].bookId;
              const isBookSelected = selectedBooks.some(
                (book) => book.book.id === bookId
              );
              const isBookSynced = syncedBefore.some(
                (book) => book.book.id === bookId
              );

              if (isBookSynced || isBookSelected) {
                return (
                  <Book
                    key={bookId}
                    content={item}
                    allBooks={highlights.allBooks}
                    selectedBooks={selectedBooks}
                    handleSync={handleSyncBook}
                  />
                );
              }
              return null;
            })
          : null}
        {syncedBefore.length === 0 && selectedBooks.length === 0 ? (
          <p>No synced books yet</p>
        ) : null}
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
