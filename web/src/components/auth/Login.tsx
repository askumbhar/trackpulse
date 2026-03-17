import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import axios from "axios";
import { useAuth } from "../store/AuthContext"; // adjust path if needed

const API_URL = "https://localhost:7156/api/users/authenticate";

function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // use the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          mobileNumber: mobile,
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      const userData = response.data; // assuming this contains id, username, role etc.

      // Store user in context (login function sets the user state)
      login(userData);

      console.log(userData.role);
      
      // Navigate based on role
      if (userData.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "User") {
        navigate("/dashboard");
      } else {
        setError("Invalid role");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label>Mobile Number</label>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"   // <-- This already hides the password characters
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="login-footer">
          Don't have account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;