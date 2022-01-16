import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Movies from './components/Movies';
import Admin from './components/Admin';
import Home from './components/Home';
import Genres from './components/Genres';
import OneMovie from './components/OneMovie';
import OneGenre from './components/OneGenre';
import EditMovie from './components/EditMovie';
import Login from './components/Login';

export default function App(props) {
  const [jwt, setJwt] = useState('');

  let loginLink;

  useEffect(() => {
    let t = window.localStorage.getItem('jwt');
    if (t) {
      if (jwt === '') {
        setJwt(t);
      }
    }
  }, [jwt]);

  const handleJWTChange = (jwt) => {
    setJwt(jwt);
  };

  const logout = () => {
    setJwt('');
    window.localStorage.removeItem('jwt');
  };

  if (jwt === '') {
    loginLink = <Link to="/login">Login</Link>;
  } else {
    loginLink = (
      <Link to="/logout" onClick={logout}>
        Logout
      </Link>
    );
  }

  return (
    <Router>
      <div className="container">
        <div className="row">
          <div className="col mt-3">
            <h1 className="mt-3">Go Watch a Movie!</h1>
          </div>
          <div className="col mt-3 text-end">{loginLink}</div>
          <hr className="mb-3" />
        </div>
        <div className="row">
          <div className="col-md-2">
            <nav>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/movies">Movies</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/genres">Genres</Link>
                </li>
                {jwt !== '' && (
                  <>
                    <li className="list-group-item">
                      <Link to="/admin/movies/0">Add Movie</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/admin">Manage Catalog</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
          <div className="col-md-10">
            <Routes>
              <Route path="/movies/:id" element={<OneMovie />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/genres/:id" element={<OneGenre />} />
              <Route
                exact
                path="/login"
                element={<Login {...props} handleJWTChange={handleJWTChange} />}
              />
              <Route exact path="/genres" element={<Genres />} />
              <Route
                path="/admin/movies/:id"
                element={<EditMovie {...props} jwt={jwt} />}
              />
              <Route path="/admin" element={<Admin {...props} jwt={jwt} />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
