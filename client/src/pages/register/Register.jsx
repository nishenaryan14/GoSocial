import "./register.css";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const [file, setFile] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  //useHistory for redirecting the user to login page
  const navigate = useNavigate();
  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        profilePicture: null,
      };
      if (file) {
        const dp = new FormData();
        const fileName = Date.now() + file.name;
        dp.append("name", fileName);
        dp.append("file", file);

        try {
          const response = await axios.post(`${apiUrl}/upload`, dp);
          user.profilePicture = response.data; // Set the img field to the received image URL
        } catch (err) {
          console.log(err);
        }
      }
      try {
        setIsFetching(true);
        await axios.post(`${apiUrl}/auth/register`, user);
        navigate("/login");
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    }
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Gosocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Gosocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="UserName"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              type="email"
              required
              ref={email}
              className="loginInput"
            />
            <input
              placeholder="Password"
              type="password"
              required
              ref={password}
              className="loginInput"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              type="password"
              required
              ref={passwordAgain}
              className="loginInput"
            />
            <label htmlFor="profilePic" className="shareOption">
              <AddPhotoAlternateIcon htmlColor="tomato" className="shareIcon" />
              <span className="profilePic">Your DP</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="profilePic"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link
              to="/login"
              style={{ alignSelf: "center" }}
              className="loginRegisterButton"
            >
              <button>Log into Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
