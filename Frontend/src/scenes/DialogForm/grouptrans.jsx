import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Mybuttons from "../Button/button.jsx";
import transactionContext from "../../context/Transaction/TransactionContext";
import axios from "axios";
import { tokens } from "../../theme";
import { Box, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";

export default function FormDialog(props) {
  const a = React.useContext(transactionContext);
  const [open, setOpen] = React.useState(false);
  const [trans, setTrans] = React.useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const getGroupExpenses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/get_group_expenses`,
        {
          params: { group_id: props.groupId },
          withCredentials: true,
        }
      );
      const newData = response.data.map((item, index) => ({
        id: index + 1,
        ...item,
      }));
      return newData; // Ensure this returns the transformed data
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getGroupExpenses().then(setTrans); // Fetch data and set state on component mount
  }, []); // Empty dependency array to run only once on mount

  return (
    <React.Fragment>
      <Mybuttons text={props.text} handleClick={handleClickOpen}>
        {" "}
      </Mybuttons>

      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"xs"}>
        <DialogContent>
          <h1 style={{ display: "flex", justifyContent: "center" }}>Transactions</h1>
          <br />
          {trans.length> 0 ? trans.map((transaction, i) => (
            <Box
              key={`${transaction.id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px 15px 5px 15px"
            >
              <Box color={colors.grey[100]}>
              {format(new Date(transaction.expense_date), "dd MMM ")}
                </Box>
              <Box>
                <Typography color={colors.grey[100]}>
                  <h5 style={{ margin: "0", display: "inline" }}>{transaction.userinfo}</h5>
                  <h6 style={{ display: "inline", margin: "0px 7px" }}>paid for</h6>
                  <br/>
                  <h6 style={{ display: "flex", justifyContent: "center" }}>{transaction.description}</h6>
                </Typography>
              </Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ₹{transaction.amount}
              </Box>
            </Box>
          )): 
          <h4 style={{display: "flex", justifyContent: "center"}}>No transaction</h4>
          }
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
