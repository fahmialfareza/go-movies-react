import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

export default function OneMovieGraphQL() {
  const { id } = useParams();

  const [movie, setMovie] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const payload = `{
        movie(id: ${id}) {
          id
          title
          runtime
          year
          description
          release_date
          rating
          mpaa_rating
          poster
        }
      }`;

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'POST',
        body: payload,
        headers: myHeaders,
      };

      const response = await fetch(
        'http://localhost:4000/v1/graphql',
        requestOptions
      );
      const data = await response.json();
      setMovie(data.data.movie);
      setIsLoaded(true);
    } catch (err) {
      setIsLoaded(true);
      setError(err);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (movie.genres) {
    movie.genres = Object.values(movie.genres);
  } else {
    movie.genres = [];
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  return (
    <>
      <h2>
        Movie: {movie.title} {movie.year}
      </h2>

      {movie.poster && (
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
            alt="poster"
          />
        </div>
      )}

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
