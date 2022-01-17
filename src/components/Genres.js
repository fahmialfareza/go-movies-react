import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/genres`
      );

      if (response.status !== 200) {
        let err = 'Invalid response code: ' + response.status;
        setError({ message: err });
        setIsLoaded(true);
        return;
      }

      const json = await response.json();

      setGenres(json.genres);
      setIsLoaded(true);
    } catch (err) {
      setIsLoaded(true);
      setError(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  return (
    <>
      <h2>Genres</h2>

      <div className="list-group">
        {genres.map((m) => (
          <Link
            key={m.id}
            className="list-group-item list-group-item-action"
            to={`/genres/${m.id}`}
          >
            {m.genre_name}
          </Link>
        ))}
      </div>
    </>
  );
}
