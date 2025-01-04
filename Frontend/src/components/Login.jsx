import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { useEffect } from "react";
import { useGoogleLogin, GoogleLogin, googleLogout } from "@react-oauth/google";
import transactionContext from "../context/Transaction/TransactionContext"

const Login = () => {
  const [state, setState] = useState({
    username: "",
    password: "",
    success: false,
    error: false,
  });
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState([]);
  const a = React.useContext(transactionContext);
  // const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const { username, password } = state;
    // window.localStorage.setItem("isAuthenticated", false);
    // window.localStorage.setItem("username", "");
    try {
      const res = await axios.post(
        "http://localhost:4000/login",
        { username, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        window.localStorage.setItem("isAuthenticated", true);
        window.localStorage.setItem("username", res.data.userinfo);
        setState((prevState) => ({
          ...prevState,
          success: true,
          error: "",
        }));
        navigate("/dashboard");
      }
    } catch (err) {
      setAlert({ show: true, message: err.response.data.error });
      setState({ username: "", password: "", success: false, error: false });
    }
  };
  const handlegoogleLogin1 = async () => {
    // console.log("inside google user data");
    // e.preventDefault();
    try {
      const res = axios.get("http://localhost:4000/auth/success121", {
        withCredentials: true,
      });
      if (res.status === 200) {
        window.localStorage.setItem("isAuthenticated", true);
        window.localStorage.setItem("username", "google");
        setState((prevState) => ({
          ...prevState,
          success: true,
          error: "",
        }));
        navigate("/dashboard");
      }
    } catch (err) {
      setAlert({ show: true, message: err.response.data.error });
      setState({ username: "", password: "", success: false, error: false });
    }
  };

  

  const handleMouseEnter = () => {
    setShowPassword(true);
  };

  const handleMouseLeave = () => {
    setShowPassword(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      setAlert({ show: false, message: "" });
    }
    setAlert({ show: false, message: "" });
    return;
  };
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    // onError: (error) => console.log("Login Failed:", error),
  });
  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  const hello = async () => {
    // console.log(a.Gprofile);
    const res = await axios.post(
      "http://localhost:4000/auth/google/user_details",
      { profile: a.Gprofile },
      { withCredentials: true }
    );
    try {
      if (res.status === 200) {
        // console.log(115);
        window.localStorage.setItem("isAuthenticated", "true23");
        window.localStorage.setItem("username", a.Gprofile.given_name);
        setState((prevState) => ({
          ...prevState,
          success: true,
          error: "",
        }));
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect(() => {
  //     handlegoogleLogin1(); // Fetch user data only after redirect back from Google
  // }, []);
  useEffect(() => {
    if (a.Gprofile) {
      hello();
    }
  }, [a.Gprofile]);
  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          a.GsetProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);
  const logOut = () => {
  //   localStorage.clear(); // Or remove specific keys
  // sessionStorage.clear();
    googleLogout();
    a.GsetProfile(null);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        onClose={handleCloseAlert}
        key={"top" + "center"} // React uses key to decide whether to update or replace a component. When the key changes, React knows that the current Snackbar instance is different from the previous one, so it re-renders the component.
        autoHideDuration={4000}
      >
        {alert.show && (
          <Alert severity="error" onClose={handleCloseAlert}>
            {alert.message}
          </Alert>
        )}
      </Snackbar>
      <div className="container mt-5">
        <h1>Login</h1>
        <div className="row">
          <div className="col-sm-8">
            <div className="card">
              <div className="card-body">
                <form onSubmit={onLogin}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="username"
                      value={state.username} //iss se input field bind ho jaega and jase hi gall password dalega to vaha sum hatt jaega
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"} // Toggle input type
                        className="form-control"
                        name="password"
                        value={state.password}
                        onChange={handleChange}
                        style={{borderRightColor:"white", borderRight:'0px', outline:'none', boxShadow:'none'}}
                        required
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          style={{ cursor: "pointer", height:"38px", width:"44px", borderRadius: "0px 6px 6px 0px", borderLeftColor:"white", backgroundColor:"white"}}
                        >
                          <i
                            className={
                              showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                            }
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-dark"
                    style={{ margin: "20px 5px 0px 0px" }}
                  >
                    Login
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark"
                    style={{ margin: "20px 5px 0px 0px" }}
                    onClick={handleClick}
                  >
                    Sign Up
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            {/* <div className="card">
              <div className="card-body">
                <a className="btn btn-block" href="#"  role="button" onClick={handleGoogleLogin}>
                  <i className="fab fa-google"><br></br></i>
                   Sign In with Google
                </a>
              </div>
            </div> */}
            <div>
                {/* <button onClick={() => login()}>Sign in with Google 🚀 </button> */}
              <div className="card">
                <div className="card-body">
                  <a className="btn btn-block" href="#" role="button" onClick={() => login()}>
                    <i className="fab fa-google">
                      <br></br>
                    </i>
                    Sign In with Google
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <footer>Additional footer content can go here</footer> */}
      {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
    </div>
  );
};

export default Login;
// "http://localhost:4000/auth/google"
