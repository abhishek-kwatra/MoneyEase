import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

function Mybuttons(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (props.text == "Show Users" || props.text == "Show Transactions" ? (
      <a role="button" onClick={() => props.handleClick()}>{props.text} </a>
    ) : (
      <Button
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          // fontSize: "14px",
          fontWeight: "bold",
          padding: "10px 20px",
          marginRight: "10px",
        }}
        onClick={() => props.handleClick()}
      >
        {props.text}
      </Button>
    ));
}
export default Mybuttons;

{
  /* <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              marginRight: "10px"
            }}
            onClick={handleChange}
          >
            {/* <DownloadOutlinedIcon sx={{ mr: "10px" }} /> */
}
// Add an Expense

//   </Button> */}
