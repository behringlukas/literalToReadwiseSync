import React, { useEffect, useState } from "react";
import axios from "axios";

function useFetchLiteralUser(handle) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .post("https://literal.club/graphql/", {
        query:
          "query getProfileParts($handle: String!) {profile(where: { handle: $handle }) {\n  id   handle  name   bio  image   invitedByProfileId }}",
        variables: {
          handle: handle,
        },
      })
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handle]);

  return { user, loading, error };
}

export default useFetchLiteralUser;
