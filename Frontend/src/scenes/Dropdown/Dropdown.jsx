import * as React from "react";
import Box from "@mui/material/Box";
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import transactionContext from "../../context/Transaction/TransactionContext";
import axios from "axios";

export default function BasicSelect(props) {
  const a = React.useContext(transactionContext);
  const [paidby, setPaidBy] = React.useState([]);
  const [friends, setFriends] = React.useState([]);

  const handleChange = (event) => {
    console.log(a.paidby);    
    a.setPaidBy(event.target.value);
  };
  const handleSettleChange = (event) =>{
    props.OnChange(event.target.value);
  }

  const getfriends = async() =>{
    try{
      const response = await axios.get(`http://localhost:4000/get_friends`,{
        withCredentials: true
      })     
      return response.data
    }catch(err){
      console.log(err);
    }
  }
  React.useEffect(() => {   
    async function updatePaidBy() {
      let updatedPaidBy = [...a.personName];
      // Check if the type is "group"
      for (const person of a.personName) {
        console.log(person.type);
        
        if (person.type === "group") {
          try {
            // Fetch group members
            const response = await axios.get(
              `http://localhost:4000/get_group_members`,
              {
                params: { group_id: person.group_id },
                withCredentials: true,
              }
            );
            // const groupMembers = response.data.filter(
            //   (member) => member.username !== "user@passportlocalmongoose.com"
            // );
            // Filter out group members already in paidby as "friend"
            const newMembers = response.data.filter((member) => 
              updatedPaidBy.every((existingMember) => 
                existingMember.user_id !== member.user_id &&
                existingMember.username !== member.username
              )
            );
                      
            // Add group members to the paidby state
            updatedPaidBy = [...updatedPaidBy, ...newMembers];
            // Filter out objects with type "group"
            updatedPaidBy = updatedPaidBy.filter((member) => member.type !== "group");

          } catch (error) {
            console.error("Error fetching group members:", error);
          }
        }
      }
      setPaidBy(updatedPaidBy);
    }
    updatePaidBy();
  }, [a.personName]);

  // React.useEffect(() => {
  //   setPaidBy([...a.personName]);
  // }, [a.personName]);

  React.useEffect(()=>{
    getfriends().then(setFriends)
    console.log(82, friends);
    }, 
  []);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        {/* <InputLabel id="demo-simple-select-label">You</InputLabel> */}
        {props.selectType === "type1" && <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={a.paidby}
          label="Age"
          onChange={handleChange}
        >
          {paidby.map((payees) => (
            <MenuItem value={payees}>{payees.username}</MenuItem>
          ))}
        </Select>}
        {props.selectType === "type2" && <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={a.paidby}
          label="Age"
          onChange={handleSettleChange}
        >
          {friends.map((friend) => (
            <MenuItem value={friend}>{friend.username}</MenuItem>
          ))}
        </Select>}
      </FormControl>
    </Box>
  );
}
