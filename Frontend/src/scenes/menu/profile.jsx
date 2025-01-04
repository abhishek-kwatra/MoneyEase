import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import transactionContext from "../../context/Transaction/TransactionContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin, GoogleLogin, googleLogout } from "@react-oauth/google";

export default function Profile() {
  const navigate = useNavigate();
  const a = React.useContext(transactionContext);
  const open = Boolean(a.profile);
  
  const handleClose = () => {
    a.setProfile(null);
  };
  const handleClick = (event) => {
    a.setProfile(event.currentTarget);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:4000/logout", {}, { withCredentials: true });
      if (res.status === 200) {
        window.localStorage.removeItem("isAuthenticated"); // Changed from true to false
        window.localStorage.removeItem("username")
        googleLogout();
        localStorage.clear(); // Or remove specific keys
        sessionStorage.clear();
        a.setProfile(null);
        a.GsetProfile(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  return (
    <div>
      <Button
        style={{ display: "none" }}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={a.profile}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
