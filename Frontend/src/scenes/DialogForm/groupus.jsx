import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Mybuttons from "../Button/button.jsx";
import transactionContext from "../../context/Transaction/TransactionContext";
import axios from "axios";
import { tokens } from "../../theme";
import { Box, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";


export default function FormDialog(props) {
  const a = React.useContext(transactionContext);
  const [open, setOpen] = React.useState(false);
  const [groupmembers, setGroupmembers] = React.useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  function handleClickOpen() {
    setOpen(true);
    getGroupMember();
  }
  const handleClose = () => {
    setOpen(false);
  };
  const getGroupMember = async () => {
    const response = await axios.get(
      `http://localhost:4000/get_group_members`,
      {
        params: { group_id: props.groupId },
        withCredentials: true,
      }
    );
    return response.data;
  };
  React.useEffect(()=>{
    getGroupMember().then(setGroupmembers);
  }, []);

  return (
    <React.Fragment>
      <Mybuttons text={props.text} style={{backgroundColor: "none"}}  handleClick={() => handleClickOpen()}>
        {" "}
      </Mybuttons>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={"xs"}
        >
          <DialogContent>
            <h1 style={{ display: "flex", justifyContent: "center" }}>
              Users
            </h1>
            <br />
            {groupmembers.length>0 ? groupmembers.map((members,i)=>(
              <Box
              key={`${members.id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px 15px 5px 15px"
            >
              <Box color={colors.grey[100]}>
              {i+1}
                </Box>
              
              <Box>
                <Typography color={colors.grey[100]}>
                  <h4 style={{ margin: "0", display: "inline" }}>{members.userinfo}</h4>
                  <h5 style={{ display: "inline", margin: "0px 7px 0px 10px" }}>joined at</h5>
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>
              <h6 style={{ display: "inline" }}>{format(new Date(members.joined_at), "dd MMM ")}</h6>
                </Box>
            </Box> 
            )):  <h4 style={{display: "flex", justifyContent: "center"}}>No Users</h4>}

            <DialogContentText>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
    </React.Fragment>
  );
}