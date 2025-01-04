import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import UnstyledInputIntroduction from "../Input/Input";
import TextField from "@mui/material/TextField";
import transactionContext from "../../context/Transaction/TransactionContext";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Chip from "@mui/material/Chip";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

export default function GroupMenu() {
  const [isHovered, setIsHovered] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [usernames, setUsernames] = React.useState([]);
  const [alert, setAlert] = React.useState({ show: false, message: "" , severity:"error"});

  const a = React.useContext(transactionContext);
  const open = Boolean(a.group);

  const handleClick = (event) => {
    a.setGroup(event.currentTarget);
  };

  const handleClose = () => {
    a.setGroup(null);
    setInputValue("");
    setUsername("");
    setUsernames([]);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUsernameChange = async (event) => {
    setUsername(event.target.value);
    // if (value.length > 0) {
    //   try {
    //     const response = await axios.get(`http://localhost:4000/api/friends?query=${value}`);
    //     setOptions(response.data);
    //   } catch (err) {
    //     console.error('Error fetching friends', err);
    //   }
    // } else {
    //   setOptions([]);
    // }
  };

  const handleAddUsername = () => {
    // console.log("from handleAdduserName");
    if (username && !usernames.includes(username)) {
      setUsernames([...usernames, username]);
      setUsername("");
    }
  };
  const handleDeleteUsername = (userToDelete) => () => {
    setUsernames(usernames.filter((user) => user !== userToDelete));
  };

  const handleClickAddGroup = async (e) => {
    //here this below will not work beacuase the input value object does not
    //contain a property named
    // const {group} = inputValue;
    e.preventDefault();
    try {    
      const response = await axios.post(
        "http://localhost:4000/creategroup",
        { group: inputValue, usernames: usernames },
        { withCredentials: true }
      );
      if (response.data) {
        setAlert({ show: true, message: "Group Added Successfully" , severity: "success"});
        a.setGroup(null);
        setInputValue("");
        setUsername("");
        setUsernames([]);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setAlert({ show: true, message: err.response.data.error, severity: "error" });
      } else {
        console.log("Error making group", err);
      }
    }
  };

  const handleCloseAlert = (event, reason) => {
    // console.log(reason);
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ show: false, message: "" });
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
          <Alert
            severity={alert.severity}
            onClose={handleCloseAlert}
          >
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
        anchorEl={a.group}
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
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <MenuItem>
            {/* <Autocomplete
              sx={{width: "150px"}}
              disablePortal
              id="username-autocomplete"
              options={options.map((option) => option.username)}
              value={username}
              onInputChange={handleUsernameChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="standard-basic"
                  label="Enter Username"
                  variant="standard"
                />
              )}
            /> */}
            <TextField
              id="standard-basic"
              label="Enter Username"
              variant="standard"
              autoComplete="off"
              value={username}
              onChange={handleUsernameChange}
            />
          </MenuItem>
          <a
            role="button"
            // style={{ textDecoration: "none" }}
            onClick={handleAddUsername}
          >
            <AddIcon />
          </a>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            maxWidth: "300px", // Set a max width for the container
            marginTop: "10px",
          }}
        >
          {usernames.map((user) => (
            <Chip
              key={user}
              label={user}
              onDelete={handleDeleteUsername(user)}
              deleteIcon={<ClearIcon />}
              style={{ margin: "5px" }}
            />
          ))}
        </div>
        {inputValue && (
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant={isHovered ? "contained" : "text"}
              sx={{ borderRadius: "20px" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleClickAddGroup}
            >
              Create Group
            </Button>
          </div>
        )}
      </Menu>
    </div>
  );
}
