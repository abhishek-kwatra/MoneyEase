import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '../styles.css';
import axios from 'axios';
import { Height } from '@mui/icons-material';
import { useGoogleLogin, } from "@react-oauth/google";
import transactionContext from "../context/Transaction/TransactionContext"
import { useEffect } from 'react';

const Register = () => {
  const [state, setState] = useState({
    username: "",
    password: "",
    userinfo:"",
    username2:"",
    contact_number:"",
    success: false,
    error: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const a = React.useContext(transactionContext);
  const navigate = useNavigate();

  const handleClick = () =>{
    navigate("/login");
  }
  const handleMouseEnter = () => {
    setShowPassword(true);
  };

  const handleMouseLeave = () => {
    setShowPassword(false);
  };

  const onSignup = async (e) => {
    e.preventDefault();
    const { username, password , userinfo, username2, contact_number} = state;
    // console.log("ON signup", username, password, userinfo);
    try {
      const res = await axios.post("http://localhost:4000/register", {  username, password, userinfo, username2, contact_number },{withCredentials: true});
      if (res.status === 200) {
        // console.log(res.data);
        window.localStorage.setItem("isAuthenticated", true);
        window.localStorage.setItem("username", userinfo);
        setState((prevState) => ({
          ...prevState,
          success: true,
          error: "",
        }));
        navigate("/Dashboard")
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setState((prevState) => ({
          ...prevState,
          success: false,
          error: err.response.data.message,
        }));
        navigate('/login');  
      } else {
        setState((prevState) => ({
          ...prevState,
          error: err.message,
          success: false,
        }));
      }
    }
  };

  const handleChange = (e) => {
    //new thing
    const {name, value}= e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // console.log(name,":", value);    
  };

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log("Login Failed:", error),
  });

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


  return (
    <div>
      <header>
        <meta charSet="utf-8" />
        <title>Secrets</title>
      </header>
      <div className="container mt-5">
        <h1>Register</h1>
        <div className="row">
          <div className="col-sm-8">
            <div className="card">
              <div className="card-body">
                <form  onSubmit={onSignup} >
                {/* <form action="http://localhost:4000/register" method="POST"></form> */}
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" name="username" onChange={handleChange} required  />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userinfo">First Name</label>
                    <input type="username" className="form-control" name="userinfo" onChange={handleChange} required maxLength={15} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userinfo">Last Name</label>
                    <input type="username" className="form-control" name="username2" onChange={handleChange}  maxLength={15} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userinfo">Contact Number</label>
                    <input type="username" className="form-control" name="contact_number" onChange={handleChange} required maxLength={10} minLength={10} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"} className="form-control" name="password" onChange={handleChange} style={{borderRightColor:"white", borderRight:'0px', outline:'none', boxShadow:'none'}} required />
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
                  
                  <button type="submit" className="btn btn-dark" style={{margin: '20px 5px 0px 0px'}}>Register</button>
                  <button  className="btn btn-dark" style={{margin: '20px 5px 0px 0px'}} onClick={handleClick}>Login</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
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
      {/* <footer> */}
        {/* Additional footer content can go here */}
      {/* </footer> */}
    </div>
  );
};

export default Register;
