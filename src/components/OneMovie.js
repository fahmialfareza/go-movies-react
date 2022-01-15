import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

export default function OneMovie() {
  const { id } = useParams();

  const [movie, setMovie] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/v1/movie/${id}`);

      if (response.status !== 200) {
        let err = 'Invalid response code: ' + response.status;
        setError({ message: err });
        setIsLoaded(true);
        return;
      }

      const json = await response.json();

      setMovie(json.movie);
      setIsLoaded(true);
    } catch (err) {
      setIsLoaded(true);
      setError(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (movie.genres) {
    movie.genres = Object.values(movie.genres);
  } else {
    movie.genres = [];
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  } else if (!isLoaded) {
    return <p>Loading</p>;
  }

  return (
    <>
      <h2>
        Movie: {movie.title} {movie.year}
      </h2>

      <div className="float-start">
        <small>Rating: {movie.mpaa_rating}</small>
      </div>
      <div className="float-end">
        {movie &&
          movie.genres &&
          movie.genres.map((m, index) => (
            <span className="badge bg-secondary me-1" key={index}>
              {m}
            </span>
          ))}
      </div>
      <div className="clearfix"></div>

      <hr />

      <table className="table table-compact table-striped">
        <thead></thead>
        <tbody>
          <tr>
            <td>
              <strong>Title:</strong>
            </td>
            <td>{movie.title}</td>
          </tr>
          <tr>
            <td>
              <strong>Description: </strong>
            </td>
            <td>{movie.description}</td>
          </tr>
          <tr>
            <td>
              <strong>Run time:</strong>
            </td>
            <td>{movie.runtime} minutes</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
