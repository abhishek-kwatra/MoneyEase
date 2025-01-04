import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from '@mui/material/DialogTitle';
import Mybuttons from "../Button/button.jsx";
import MultipleSelectChip from "../MiltiSelectDropdown/MultiSelectDropDown.jsx";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import BasicSelect from "../Dropdown/Dropdown.jsx";
import { FormControlLabel, Checkbox } from "@mui/material";
import transactionContext from "../../context/Transaction/TransactionContext";
import axios from "axios";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import { useEffect } from "react";

export default function FormDialog(props) {
  const a = React.useContext(transactionContext);
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState([true, false]);
  const [person, setPerson] = React.useState("");
  const [settleamount, setSettleAmount] = React.useState();
  const [alert, setAlert] = React.useState({ show: false, message: "" , severity: ""});

  async function handleSubmit() {
    try {
      console.log(a.paidby);      
      a.finalprint("33",a.personName, a.paidby, a.amount, a.description, a.split);
      console.log("I was here");      
      const response = await axios.post(
        "http://localhost:4000/expenses",
        {
          personName: a.personName,
          description: a.description,
          amount: a.amount,
          paidby: a.paidby,
          split: a.split,
        },
        { withCredentials: true }
      );
      handleClose();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
  function handleClickOpen() {
    setOpen(true);
  }
  function handleCheck() {
    let temp1 = checked[0];
    let temp2 = checked[1];
    setChecked([temp2, temp1]);
  }

  const handleClose = () => {
    setOpen(false);  
    a.setPersonName([{ username: "You", type: "friend" }]);
    a.setPaidBy();
    a.setAmount("");
    a.setDescription("");
    a.setSplit("Equally");
    // console.log(63,"Value of settleamount before", a.settleamount);  
    a.setSettleAmount("");
    // console.log(63,"Value of settleamount after ", a.settleamount);  
  };

  async function handleChange1(value) {
    setPerson(value);
  }

  async function getSettle() {
    try {
      const response = await axios.post("http://localhost:4000/settle", {
          personId: person.user_id,
          amount: a.settleamount,
        },
        { withCredentials: true }
      );
      if(response.status == '200'){
        setAlert({ show: true, message: "Settled Successfully", severity: "success" });
        handleClose();
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setAlert({ show: true, message: err.response.data.error , severity:"error"});
      }
    }
  }
  const handleCloseAlert = (event, reason) => {
    console.log(reason);
    if (reason === "clickaway") {
      return;
    }
    setAlert({ show: false, message: "" });
  };
  

  return (
    <React.Fragment>
      <Mybuttons text={props.text} handleClick={() => handleClickOpen()}>
        {" "}
      </Mybuttons>

      {props.text === "Add an Expense" && (
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={"xs"}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              checked[0]
                ? a.setSplit("Split Equally")
                : a.setSplit("Split Unequally");
              handleClose();
            },
          }}
        >
          <DialogContent>
            <h1 style={{ display: "flex", justifyContent: "center" }}>
              Add an Expense
            </h1>
            <MultipleSelectChip text="With " />
            <TextField
              id="description"
              name="description"
              onChange={(e) => a.setDescription(e.target.value)}
              label="Enter Description"
              variant="filled"
              sx={{ h: "2px", width: "100%" }}
            />
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              name="amount"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Amount"
              onChange={(e) => a.setAmount(e.target.value)}
            />
            <br />
            <DialogContentText>
              <div style={{ marginTop: "6px" }}>
                Paid by <BasicSelect selectType="type1" text="you" />
                <h2 style={{ margin: "0px" }}>Split</h2>
                <FormControlLabel
                  control={
                    <Checkbox checked={checked[0]} onChange={handleCheck} />
                  }
                  label="Equally"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={checked[1]} onChange={handleCheck} />
                  }
                  label="Unequally"
                />
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={handleSubmit}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {props.text === "Settle Up" && (
        <>
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
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={"xs"}
        >
          <DialogContent>
            <h1 style={{ display: "flex", justifyContent: "center" }}>
              Settle Up
            </h1>
            Select Borrower{" "}
            <BasicSelect
              selectType="type2"
              text="you"
              OnChange={handleChange1}
            />
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              name="amount"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              onChange={(e) => a.setSettleAmount(e.target.value)}
              label="Amount"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={getSettle}>
              Settle Up
            </Button>
          </DialogActions>
        </Dialog>
        </>
      )}
    </React.Fragment>
  );
}

/* <Button variant="outlined" onClick={handleClickOpen}> </Button>  */

// React.useEffect(()=>{
//   if(checked[0]){
//     console.log("Split Equally");
//   }
//   else{
//     console.log("Split Unequally");
//   }
// },[checked])
