import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import Input from './form-components/Input';

export default function GraphQL() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const payload = `{
        list {
          id
          title
          runtime
          year
          description
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
        `${process.env.REACT_APP_API_URL}/v1/graphql`,
        requestOptions
      );
      const data = await response.json();

      let theList = Object.values(data.data.list);
      setMovies(theList);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event) => {
    let value = event.target.value;
    setSearch(value);

    if (value.length > 2) {
      performSearch();
    } else {
      setMovies([]);
    }
  };

  const performSearch = async () => {
    try {
      const payload = `{
        search(titleContains: "${search}") {
          id
          title
          runtime
          year
          description
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
        `${process.env.REACT_APP_API_URL}/v1/graphql`,
        requestOptions
      );
      const data = await response.json();

      let theList = Object.values(data.data.search);

      if (theList.length > 0) {
        setMovies(theList);
      } else {
        setMovies([]);
      }
    } catch (error) {}
  };

  return (
    <>
      <h2>GraphQL</h2>
      <hr />

      <Input
        title="Search"
        type="text"
        name="search"
        value={search}
        handleChange={handleChange}
      />
      <div className="list-group">
        {movies.map((movie) => (
          <Link
            to={`/moviesgraphql/${movie.id}`}
            key={movie.id}
            className="list-group-item list-group-item-action"
          >
            <strong>{movie.title}</strong>
            <small className="text-muted">
              ({movie.year} - {movie.runtime} minutes)
            </small>
            <br />
            {movie.description.slice(0, 100)}...
          </Link>
        ))}
      </div>
    </>
  );
}
