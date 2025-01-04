import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import transactionContext from "../../context/Transaction/TransactionContext";

export default function Filter(props) {
  
  const a = React.useContext(transactionContext);
  const open = Boolean(a.filter);

  const handleClick = (event) => {
    a.setFilter(event.currentTarget);
  };
  const sortByAmount = () => {      
    if (Array.isArray(props.transactions)) {
      const sortedTransactions = [...props.transactions].sort((a, b) => a.cost - b.cost);
      props.setTransactions(sortedTransactions);
    } else {
      console.error("transactions1 is not an array:", props.transactions);
    }
    handleClose();
  };
  const sortByDate = () => {
    if (Array.isArray(props.transactions)) {
      const sortedByDate = [...props.transactions].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
  
        // Compare by date first
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
  
        // If dates are equal, compare by time
        return dateA.getTime() - dateB.getTime();
      });
  
      props.setTransactions(sortedByDate);
    } else {
      console.error("transactions1 is not an array:", props.transactions);
    }  
    handleClose();
  };  

  const handleClose = () => {
    a.setFilter(null);
  };

  return (
    <div>
      {/* {console.log("rer", props.transactions1)} */}
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
        anchorEl={a.filter}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem><h5>Sort By</h5></MenuItem>
        <MenuItem onClick={sortByDate}><p style={{textAlign: "right"}}>By Date</p></MenuItem>
        <MenuItem onClick={sortByAmount}><p>By Amount</p></MenuItem>
      </Menu>
    </div>
  );
}
