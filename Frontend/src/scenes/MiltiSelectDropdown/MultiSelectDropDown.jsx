import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import transactionContext from "../../context/Transaction/TransactionContext";
import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      // personName.indexOf(name) === -1
      //   ? theme.typography.fontWeightRegular
      //   : theme.typography.fontWeightMedium,
      theme.typography.fontWeightMedium
  };
}

export default function MultipleSelectChip(props) {
  const [names, setNames] = React.useState([]);
  const theme = useTheme();
  const a = React.useContext(transactionContext);
  // const [personName, setPersonName] = React.useState([
  //   { user_id: 155, username: "You", type: "friend" },
  // ]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const updatedPersonName = Array.isArray(selectedValue) ? selectedValue : selectedValue.split(",");    
    a.setPersonName(updatedPersonName);
    // setPersonName(updatedPersonName);
    console.log(a.updatedPersonName);
  };
  
  async function getGroups() {
    const url = "http://localhost:4000/get_groups";
    try {
      const response = await axios.get(url, { withCredentials: true });
      const groups = response.data.map((group) => ({
        ...group,
        type: "group",
      }));
      return groups;
    } catch (err) {
      console.log(err);
    }
  }
  async function getFriends() {
    const url = "http://localhost:4000/get_friends";
    try {
      const response = await axios.get(url, { withCredentials: true });
      const friends = response.data.map((friend) => ({
        ...friend,
        type: "friend",
      }));
      return friends;
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect(() => {
    getGroups().then(setNames);
    getFriends().then((friends) => {
      setNames((prevValues) => [...prevValues, ...friends]);
    });
    console.log(a.personName);    
  }, []);

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: "50%", width: "100%" }}>
        <InputLabel id="demo-multiple-chip-label">{props.text}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={a.personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value.user_id || value.group_id}
                  label={value.username || value.group_name}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            console.log("107"),            
            <MenuItem
              key={name.type === "friend" ? name.user_id : name.group_id}
              value={name}        // The value prop in the MenuItem should be the entire object so that when you select an item, you get the whole object in the value of the Select component.
              style={getStyles(
                name.type === "friend" ? name.username : name.group_name,
                a.personName,
                theme
              )}
            >
              {name.type === "friend" ? name.username : name.group_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
