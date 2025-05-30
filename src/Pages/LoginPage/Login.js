import { useEffect, useState } from "react";
import "./Login.css";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, logIn, isAuthenticated } = useUser();

  const navigate = useNavigate();

  const emailNPasswords = {
    tutor: {
      tutor1: "fausto.mertz@eduspark.edu.mm",
      tutor2: "prudence.murray@eduspark.edu.mm",
      tutor3: "meredith.funk@eduspark.edu.mm",
    },
    student: {
      student1: "aliyah.gibson@eduspark.edu.mm",
      student2: "francesco.feil@eduspark.edu.mm",
      student3: "kaitlin.parisian@eduspark.edu.mm",
      student4: "susie.baumbach@eduspark.edu.mm",
    },
    staff: {
      staff1: "guadalupe.harris@eduspark.edu.mm",
    },
  };

  console.log(emailNPasswords);

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
    console.log(email);
    logIn(email, password);
  };

  return (
    <div className="loginMainframe">
      {/* <div className="container"> */}
      <div className="login-box">
        <h1 className="title">
          <img src="/logo.png" alt="logo" />
          EduSpark eTutoring System
        </h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="form-wrapper">
          <div className="input-field-group">
            <span className="label">Email</span>
            <input
              type="email"
              placeholder="example@eduspark.edu.mm"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="txtEmail"
            />
          </div>
          <div className="input-field-group">
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
          <button type="submit" className="form-submit-btn">
            Login
          </button>
          <div className="sign-up">
            <input type="checkbox" required id="checkBox" />
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
