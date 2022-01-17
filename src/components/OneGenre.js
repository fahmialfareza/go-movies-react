import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function OneGenre() {
  const { id } = useParams();

  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState({ genre_name: '' });
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/movies/${id}`
      );

      if (response.status !== 200) {
        let err = 'Invalid response code: ' + response.status;
        setError({ message: err });
        setIsLoaded(true);
        return;
      }

      const json = await response.json();

      setMovies(json.movies);
      setIsLoaded(true);
    } catch (err) {
      setIsLoaded(true);
      setError(err);
    }
  }, [id]);

  const fetchGenreData = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/genre/${id}`
      );

      if (response.status !== 200) {
        let err = 'Invalid response code: ' + response.status;
        setError({ message: err });
        setIsLoaded(true);
        return;
      }

      const json = await response.json();

      setGenre(json.genre);
      setIsLoaded(true);
    } catch (err) {
      setIsLoaded(true);
      setError(err);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    fetchGenreData();
  }, [fetchData, fetchGenreData]);

  if (!movies) {
    setMovies([]);
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  return (
    <>
      <h2>Genre: {genre.genre_name} </h2>

      <div className="list-group">
        {movies.map((movie) => (
          <Link
            className="list-group-item list-group-item-action"
            to={`/movies/${movie.id}`}
            key={movie.id}
          >
            {movie.title}
          </Link>
        ))}
      </div>
    </>
  );
}
