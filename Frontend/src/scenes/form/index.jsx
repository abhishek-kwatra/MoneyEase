import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [userdetails, setuserDetails] = useState({
    username:"",
    userinfo:"",
    username2:"",
    contact_number:""
  })
  
  const getData = async ()=>{
      const res = await axios.get("http://localhost:4000/user_profile", {withCredentials:true})
        try {
          if(res.status = '200'){
            setuserDetails(res.data);
            console.log("I am here"); 
            console.log("28",userdetails); 
          }
        } catch (error) {
          console.log("I am sad");
        }
      }

  useEffect(()=>{
    getData()
  },[])


  return (
    <Box m="20px">
      <Header title="USER DETAILS"  />
          <form >
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                value={userdetails.userinfo}
                name="firstName"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                value={userdetails.username2}
                name="lastName"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                value={userdetails.username}
                name="email"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                value={userdetails.contact_number}
                name="contact"
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
          </form>     
    </Box>
  );
};

export default Form;
