import React, { useEffect, useState } from "react";
import axios from "axios";

function useFetchBooks(userId, handle) {
  const [highlights, setHighlights] = useState(null);
  const [allBooks, setAllBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .post("https://literal.club/graphql/", {
        query:
          "query booksByReadingStateAndProfile(\n    $limit: Int!\n    $offset: Int!\n    $readingStatus: ReadingStatus!\n    $profileId: String!\n  ) {\n    booksByReadingStateAndProfile(\n      limit: $limit\n      offset: $offset\n      readingStatus: $readingStatus\n      profileId: $profileId\n    ) {\n        id\n        slug\n        title\n        subtitle\n        description\n        isbn10\n        isbn13\n        language\n        pageCount\n        publishedDate\n        publisher\n        cover\n        authors {\n        id\n        name\n        }\n     }\n  }\n",
        variables: {
          limit: 400,
          offset: 0,
          readingStatus: "FINISHED",
          profileId: userId,
        },
      })
      .then(async (response) => {
        const finishedBooks = response.data.data.booksByReadingStateAndProfile;
        const bookIds = finishedBooks.map((book) => book.id);
        setAllBooks(finishedBooks);
        const booksWithHighlights = await useFetchHighlights(handle, bookIds);
        console.log(booksWithHighlights);
        const filteredBooks = booksWithHighlights.filter((book) => {
          return book.data.momentsByHandleAndBookId.length > 0;
        });
        setHighlights(filteredBooks);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, handle]);

  if (highlights !== undefined && highlights !== null) {
    console.log(highlights);
    return { highlights, allBooks, loading, error };
  }
}

async function useFetchHighlights(handle, bookIds) {
  const requests = bookIds.map((bookId) =>
    axios.post("https://literal.club/graphql/", {
      query:
        "query momentsByHandleAndBookId($bookId: String!\n    $handle: String!\n  ) {\n    momentsByHandleAndBookId(\n      bookId: $bookId\n      handle: $handle\n    ) {\n        id\n        note\n        quote\n        where\n        bookId\n        createdAt\n     }\n  }\n", // Your query here
      variables: {
        bookId: bookId,
        handle: handle,
      },
    })
  );

  try {
    const responses = await Promise.all(requests);
    const booksWithHighlights = responses.map((response) => {
      const responseData = response.data;
      return responseData;
    });
    return booksWithHighlights;
  } catch (error) {
    throw error;
  }
}

export default useFetchBooks;
