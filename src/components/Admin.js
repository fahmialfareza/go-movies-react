import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Admin({ jwt }) {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/v1/movies');

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
  }, []);

  useEffect(() => {
    if (jwt === '') {
      navigate('/login');
      return;
    }

    fetchData();
  }, [fetchData, navigate, jwt]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  return (
    <div className="list-group">
      {movies.map((movie) => (
        <Link
          className="list-group-item list-group-item-action"
          key={movie.id}
          to={`/admin/movies/${movie.id}`}
        >
          {movie.title}
        </Link>
      ))}
    </div>
  );
}
