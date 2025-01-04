import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import transactionContext from "../../context/Transaction/TransactionContext";

export default function Notification() {
  
  const a = React.useContext(transactionContext);
  const open = Boolean(a.shownotifications);

  const handleClick = (event) => {
    a.setShownotifications(event.currentTarget);
  };

  const handleClose = () => {
    a.setShownotifications(null);
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
          //       maxWidth:"true",
          // width:"md"
          fullWidth={true}
          maxWidth={"xs"}
        id="basic-menu"
        anchorEl={a.shownotifications}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem><p>There is no newssss.....</p></MenuItem>
      </Menu>
    </div>
  );
}
