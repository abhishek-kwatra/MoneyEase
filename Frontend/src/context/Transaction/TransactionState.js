import transactionContext from "./TransactionContext";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const TransactionState = (props)=>{
    const [personName, setPersonName] = useState([{  username: "You", type: "friend" },]);
    // const [personName, setPersonName] = useState([]);
    const [paidby, setPaidBy] = useState();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [split, setSplit] =  useState('Equally');
    // For menu (for adding fiends)
    const [anchorEl, setAnchorEl] = useState(null);
    const[shownotifications, setShownotifications] = useState(false);
    const [profile, setProfile] = useState(null);
    const [filter, setFilter] = useState(null);
    const [friendmenu, setFriendmenu ] = useState(null);
    const [group, setGroup] = useState(null);
    const [grouptransactions, setGrouptransactions] = useState(null);
    const [Gprofile, GsetProfile] = useState(null);
    const[settleamount, setSettleAmount] = useState(null);

    const handleClose = () => {
       setAnchorEl(null);
    };
    const finalprint = (personName, paidby, amount, description, split) =>{
        console.log("The final output is \n");
        console.log("The description is " + description);
        console.log("The amount is " + amount);
        console.log("The payees are " + JSON.stringify(personName));
        console.log("The paidby is " + JSON.stringify(paidby));
        console.log("The split is " + split);
    }

  // AuthContext variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulated login function for testing
  const login = async (username, password) => {
    // You'd replace this with an actual API call
    if (username === 'test' && password === 'password') {
      setUser({ username: 'test' });
      setLoading(false);
      navigate('/protected'); // Redirect to protected route
    } else {
      alert('Invalid credentials');
    }
  };

  // Simulated logout function
  const logout = () => {
    setUser(null);
    navigate('/login'); // Redirect to login route
  };

  // useEffect(() => {
  //   // Simulated check for an existing user session
  //   const checkSession = async () => {
  //     // Simulate loading time
  //     await new Promise(resolve => setTimeout(resolve, 500));
  //     setLoading(false);
  //   };

  //   checkSession();
  // }, []);

    return(
        <transactionContext.Provider value={{personName, setPersonName, paidby, setPaidBy, description, setDescription, 
        amount, setAmount, split, setSplit, finalprint, anchorEl, setAnchorEl, handleClose, shownotifications,
        setShownotifications, profile, setProfile, filter, setFilter, user, login, logout, loading, friendmenu, setFriendmenu, group, setGroup,
        grouptransactions, setGrouptransactions, Gprofile, GsetProfile, settleamount, setSettleAmount}}>
            {props.children}
        </transactionContext.Provider>
    )
}
export default TransactionState;














    // const [state, setState] = useState( 
    //     "payers": "harry",
    //     // "Description":"",
    //     // "amount":"",
    //     // "paidby":[],
    //     // "split":""
    // )
    // const state = {
    //     "name":"harry",
    //     "class":"5b"
    // }