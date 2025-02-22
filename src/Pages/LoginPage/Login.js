import { useEffect, useState } from "react";
import "./Login.css";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router";

function Login() {
  const [email, setEmail] = useState("@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const { user, logIn, isAuthenticated } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === "student") {
        navigate("/studentdashboard");
      }
      if (user.role === "tutor") {
        navigate("/tutordashboard");
      }
      if (user.role === "staff") {
        navigate("/staffdashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }
    setError("");
    logIn(email, password);
  };

  return (
    <div className="loginMainframe">
      {/* <div className="container"> */}
      <div className="login-box">
        <h1 className="title"> EDU Spark eTutoring System</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <span className="label">Email</span>
            <input
              type="email"
              placeholder="yourname@gmail.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="txtEmail"
            />
          </div>
          <div className="form-group">
            <span className="label">Password</span>
            <input
              type="password"
              placeholder="******"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="txtPassword"
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
          <div className="sign-up">
            <input type="checkbox" id="checkBox" />
            {/* Comment the one above and uncomment the one below */}
            {/* <input type="checkbox" required id="checkBox" /> */}
            <label className="label" htmlFor="checkBox">
              Yes, I have read to the <a href="#">Terms and Conditions</a>{" "}
            </label>
          </div>
        </form>
      </div>
    </div>
    // </div>
  );
}

export default Login;
