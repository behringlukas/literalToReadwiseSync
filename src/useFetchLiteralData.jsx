import React, { useEffect, useState } from "react";
import axios from "axios";

function useFetchLiteralData() {
  const [data, setData] = useState(null);
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
          profileId: "cl44kmp6a2540030ivrkn652tb8",
        },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export default useFetchLiteralData;
