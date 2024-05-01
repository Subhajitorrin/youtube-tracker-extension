import React,{useState} from "react";
import "./Register.css";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login({ setToggleLoginRegister }) {
  const [disableLoginBtn, setdisableLoginBtn] = useState(false);
  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      setdisableLoginBtn(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed:", error.message);
    } finally {
      setdisableLoginBtn(false);
    }
  }
  return (
    <div className="registerContainer">
      <div className="registerWrapper">
        <h2>Login Youtube Tracker</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            id="loginemail"
            placeholder="Enter your email"
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            id="loginpassword"
            placeholder="Enter your password"
          />
          <button disabled={disableLoginBtn}>
            {disableLoginBtn ? "Loading..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account ?{" "}
          <span onClick={() => setToggleLoginRegister((prev) => !prev)}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
