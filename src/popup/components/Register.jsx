import React, { useState } from "react";
import "./Register.css";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function Register({ setToggleLoginRegister }) {
  const [disableRegisterBtn, setDisableRegisterBtn] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      setDisableRegisterBtn(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        videos: [],
      });
    } catch (error) {
      console.error("Registration failed:", error.message);
    } finally {
      setDisableRegisterBtn(false);
    }
  }

  return (
    <div className="registerContainer">
      <div className="registerWrapper">
        <h2>Register Youtube Tracker</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            name="email"
            id="registeremail"
            placeholder="Enter your email"
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            id="registerpassword"
            placeholder="Enter your password"
          />
          <button type="submit" disabled={disableRegisterBtn}>
            {disableRegisterBtn ? "Loading..." : "Create an account"}
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <span onClick={() => setToggleLoginRegister((prev) => !prev)}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
