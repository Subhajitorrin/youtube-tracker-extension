import React, { useState, useEffect } from "react";
import "./App.css";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function App() {
  const [isLoading, setisLoading] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [toggleLoginRegister, setToggleLoginRegister] = useState(true);
  useEffect(() => {
    setisLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setisLoggedIn(true);
        setisLoading(false);
      } else {
        setisLoggedIn(false);
        setisLoading(false);
      }
    });
  }, []);
  if (isLoading) {
    return (
      <div className="container">
        <div
          className="wrapper loadingWrapper"
          style={{ height: isLoggedIn ? "560px" : "400px" }}
        >
          <p>Loading...</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div
          className="wrapper"
          style={{ height: isLoggedIn ? "560px" : "400px" }}
        >
          {isLoggedIn ? (
            <Home />
          ) : toggleLoginRegister ? (
            <Login setToggleLoginRegister={setToggleLoginRegister} />
          ) : (
            <Register setToggleLoginRegister={setToggleLoginRegister} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
