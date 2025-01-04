import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import UnstyledInputIntroduction from "../Input/Input";
import transactionContext from "../../context/Transaction/TransactionContext";
import axios from "axios";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";

export default function GroupMenu() {
  const [isHovered, setIsHovered] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [alert, setAlert] = React.useState({ show: false, message: "" ,  severity: "error"});

  const a = React.useContext(transactionContext);
  const open = Boolean(a.friendmenu);

  const handleClick = (event) => {
    a.setFriendmenu(event.currentTarget);
  };

  const handleClose = () => {
    a.setFriendmenu(null);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClickAddFriend = async (e) => {
    //here this below will not work beacuase the input value object does not
    //contain a property named
    // const {group} = inputValue;
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/createfriend",
        { friend_name: inputValue },
        { withCredentials: "true" }
      );
      if(response.data){
        setAlert({ show: true, message: "Friend Added Successfully", severity: "success" });
        setInputValue("");
        a.setFriendmenu(null);
      }
    } catch (err) {
      if(err.response.status === 400 && err.response.data){
        setAlert({ show: true, message: err.response.data.error, severity: "info" });
        setInputValue("");
        a.setFriendmenu(null);
      }
      else if  (err.response && err.response.data) {
        setAlert({ show: true, message: err.response.data.error ,severity: "error" });
        setInputValue("");
        a.setFriendmenu(null);
      } else {
        setAlert({ show: true, message: "Error finding user",severity: "error" });
        setInputValue("");
        a.setFriendmenu(null);
      }
    }
  };
  const handleCloseAlert = (event, reason) => {
    console.log(reason);
    if (reason === "clickaway") {
      return;
    }
    setAlert({ show: false, message: "", severity: "error" });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        onClose={handleCloseAlert}
        key={"top" + "center"}
        autoHideDuration={6000}
      >
        {alert.show && (
          <Alert severity={alert.severity} onClose={handleCloseAlert}>
            {alert.message}
          </Alert>
        )}
      </Snackbar>
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
        anchorEl={a.friendmenu}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>
          <UnstyledInputIntroduction
            value={inputValue}
            onChange={handleInputChange}
          />
        </MenuItem>
        {inputValue && (
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant={isHovered ? "contained" : "text"}
              sx={{ borderRadius: "20px" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleClickAddFriend}
            >
              ADD FRIEND
            </Button>
          </div>
        )}
      </Menu>
    </div>
  );
}
