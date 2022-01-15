import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';

import Input from './form-components/Input';
import TextArea from './form-components/TextArea';
import Select from './form-components/Select';

import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    id: 0,
    title: '',
    release_date: '',
    mpaa_rating: '',
    rating: '',
    description: '',
    runtime: '',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);
  const mpaaOptions = [
    { id: 'G', value: 'G' },
    { id: 'PG', value: 'PG' },
    { id: 'PG13', value: 'PG13' },
    { id: 'R', value: 'R' },
    { id: 'NC17', value: 'NC17' },
  ];

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
      if (json.movie) {
        const releaseDate = new Date(json.movie.release_date);

        setMovie({
          id: id,
          title: json.movie.title,
          release_date: releaseDate.toISOString().split('T')[0],
          runtime: json.movie.runtime,
          mpaa_rating: json.movie.mpaa_rating,
          rating: json.movie.rating,
          description: json.movie.description,
        });
      }

      setIsLoaded(true);
    } catch (err) {
      setIsLoaded(true);
      setError(err);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      // client side validation
      if (movie.title === '') {
        setErrors([...errors, 'title']);
      }

      if (errors.length > 0) {
        return false;
      }

      let data = new FormData(event.target);
      data.append('id', movie.id);
      const payload = Object.fromEntries(data.entries());

      const requestOptions = {
        method: 'POST',
        body: JSON.stringify(payload),
      };

      const response = await fetch(
        'http://localhost:4000/v1/admin/editmovie',
        requestOptions
      );
      data = await response.json();

      if (data.error) {
        toast.error(data.error.message);
      } else {
        toast.success('Changes saved!');
        navigate('/admin');
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const confirmDelete = (event) => {
    confirmAlert({
      title: 'Delete Movie?',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            const response = await fetch(
              `http://localhost:4000/v1/admin/deletemovie/${movie.id}`,
              { method: 'GET' }
            );
            const data = await response.json();

            if (data.error) {
              toast.error(data.error.message);
            } else {
              navigate('/admin');
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const hasError = (key) => {
    return errors.indexOf(key) !== -1;
  };

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  return (
    <>
      <h2>Add/Edit Movie</h2>
      <ToastContainer />
      <hr />
      <form onSubmit={handleSubmit}>
        <Input
          title="Title"
          type="text"
          name="title"
          value={movie.title}
          handleChange={handleChange}
          className={hasError('title') ? 'is-invalid' : ''}
          errorDiv={hasError('title') ? 'text-danger' : 'd-none'}
          errorMsg={'Please enter a title'}
        />

        <Input
          title="Release date"
          type="date"
          name="release_date"
          value={movie.release_date}
          handleChange={handleChange}
        />

        <Input
          title="Runtime"
          type="text"
          name="runtime"
          value={movie.runtime}
          handleChange={handleChange}
        />

        <Select
          title="MPAA Rating"
          name="mpaa_rating"
          options={mpaaOptions}
          value={movie.mpaa_rating}
          handleChange={handleChange}
          placeholder="Choose..."
        />

        <Input
          title="Rating"
          type="text"
          name="rating"
          value={movie.rating}
          handleChange={handleChange}
        />

        <TextArea
          title="Description"
          rows={3}
          name="description"
          value={movie.description}
          handleChange={handleChange}
        />

        <hr />

        <button className="btn btn-primary">Save</button>
        <Link to="/admin" className="btn btn-warning ms-1">
          Cancel
        </Link>
        {movie.id > 0 && (
          <a
            href="#!"
            onClick={() => confirmDelete()}
            className="btn btn-danger ms-1"
          >
            Delete
          </a>
        )}
      </form>
    </>
  );
}
