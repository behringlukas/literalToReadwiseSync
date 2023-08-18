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
  const [syncedBefore, setSyncedBefore] = useState([]);
  const [isSyncedExpanded, setIsSyncedExpanded] = useState(false);
  const [isUnsyncedExpanded, setIsUnsyncedExpanded] = useState(true);
  const [error, setError] = useState(null);

  const handleSyncBook = (book) => {
    setSelectedBooks((prevSelectedBooks) => {
      const bookIndex = prevSelectedBooks.findIndex(
        (selectedBook) => selectedBook.book.id === book.book.id
      );

      if (bookIndex !== -1) {
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
    chrome.storage.local.set({ handle, token }, () => {});
    chrome.storage.local.get(["syncedBefore"], (res) => {
      if (res.syncedBefore != undefined) {
        setSyncedBefore(res.syncedBefore);
      }
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const selectedHighlights = selectedBooks
        .map((book) => {
          return book.moments.map((moment) => {
            const cover = book.book.cover === "" ? null : book.book.cover;
            const note = moment.note === "" ? null : moment.note;
            const location = moment.location === "" ? null : moment.location;
            return {
              text: moment.quote,
              title: book.book.title,
              author: book.book.authors[0].name,
              image_url: cover,
              source_url: "https://literal.club",
              source_type: "literal_to_readwise",
              category: "books",
              note: note,
              location: location,
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

      const updatedSelectedBooks = selectedBooks.map((book) => ({
        ...book,
        selected: true,
      }));
      setSelectedBooks(updatedSelectedBooks);

      const updatedSyncedBefore = [...syncedBefore, ...updatedSelectedBooks];
      setSyncedBefore(updatedSyncedBefore);
      chrome.storage.local.set({ syncedBefore: updatedSyncedBefore }, () => {});
    } catch (error) {
      console.log(error.response.data);
      setError(error);
    }

    setSelectedBooks([]);
  };

  const getUncommonBooks = () => {
    if (syncedBefore != undefined && syncedBefore != null) {
      const syncedBookIds = syncedBefore.map((book) => book.book.id);
      console.log(highlights?.highlights);
      const uncommonBooks = highlights?.highlights?.filter((highlight) => {
        const bookId = highlight.data.momentsByHandleAndBookId?.[0]?.bookId;
        console.log("bookId" + bookId);
        console.log("syncedBookIds" + syncedBookIds);
        return !syncedBookIds.includes(bookId);
      });
      console.log("uncommonBooks" + uncommonBooks);
      return uncommonBooks;
    }
  };

  const toggleSynced = () => {
    setIsSyncedExpanded(!isSyncedExpanded);
    setIsUnsyncedExpanded(false);
  };

  const toggleUnsynced = () => {
    setIsUnsyncedExpanded(!isUnsyncedExpanded);
    setIsSyncedExpanded(false);
  };

  return (
    <div className="popup">
      <div className="toolbar">
        <button className="iconButton" onClick={() => navigate("/credentials")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 30 30"
            fill="#000000"
            stroke="#000000"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M28,14H8.8l4.62-4.62C13.814,8.986,14,8.516,14,8c0-0.984-0.813-2-2-2c-0.531,0-0.994,0.193-1.38,0.58l-7.958,7.958  C2.334,14.866,2,15.271,2,16s0.279,1.08,0.646,1.447l7.974,7.973C11.006,25.807,11.469,26,12,26c1.188,0,2-1.016,2-2  c0-0.516-0.186-0.986-0.58-1.38L8.8,18H28c1.104,0,2-0.896,2-2S29.104,14,28,14z" />
          </svg>
          <label className="buttonText">Change credentials</label>
        </button>
        <button className="iconButton">
          <a href="https://www.buymeacoffee.com/behringlukas" target="_blank">
            ☕ Buy me a coffee
          </a>
        </button>
      </div>
      <label className="unsyncedLabel" onClick={toggleUnsynced}>
        <span
          className="chevron"
          style={{
            transform: isUnsyncedExpanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          &#x276F;
        </span>
        Your finished & unsynced books
      </label>
      <div className={isUnsyncedExpanded ? "unsyncedContainer" : "hidden"}>
        {getUncommonBooks() && getUncommonBooks().length > 0 ? (
          getUncommonBooks().map((item) => (
            <Book
              key={item.data.momentsByHandleAndBookId[0].bookId}
              content={item}
              allBooks={highlights?.allBooks}
              selectedBooks={selectedBooks}
              handleSync={handleSyncBook}
            />
          ))
        ) : (
          <p className="emptySyncContainer">
            No finished books with highlights. Go read some books!
          </p>
        )}
      </div>
      <label className="syncedLabel" onClick={toggleSynced}>
        <span
          className="chevron"
          style={{
            transform: isSyncedExpanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          &#x276F;
        </span>
        Your finished & synced books
      </label>
      <div className={isSyncedExpanded ? "syncedContainer" : "hidden"}>
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
                  />
                );
              }
              return null;
            })
          : null}
        {syncedBefore.length === 0 && selectedBooks.length === 0 ? (
          <p className="emptySyncContainer">No synced books yet</p>
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
        {error && (
          <p className="error">
            Sync with Readwise not possible. Please check your token in the
            credentials and try again.
          </p>
        )}
      </div>
    </div>
  );
}

export default SyncList;
