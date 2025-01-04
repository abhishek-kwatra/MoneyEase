import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import UnstyledInputIntroduction from "../Input/Input";
import transactionContext from "../../context/Transaction/TransactionContext";

export default function BasicMenu() {
  const [isHovered, setIsHovered] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  
  const a = React.useContext(transactionContext);
  const open = Boolean(a.anchorEl);

  const handleClick = (event) => {
    a.setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    a.setAnchorEl(null);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
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
        anchorEl={a.anchorEl}
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
            >
              ADD
            </Button>
          </div>
        )}
      </Menu>
    </div>
  );
}
