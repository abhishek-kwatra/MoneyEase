import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import React, { useEffect, useState } from "react";
import FormDialog from "../DialogForm/DialogForm";
import transactionContext from "../../context/Transaction/TransactionContext";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { fetchTransactions } from "../../data/transaction";
import Filter from "../menu/filter";
import axios from "axios";

const Dashboard = () => {
  const a = React.useContext(transactionContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [dialogboxState, setDialogboxState] = useState(false);
  const [transactions1, setTransactions1] = useState([]);
  const [transactions2, setTransactions2] = useState([]);
  const [b1, setB1] = useState(true);
  const [borrowing, setBorrowing] = useState();
  const [lending, setLending] = useState();
  const [spent, setSpent] = useState();
  const [received, setReceived] = useState();
  // let totalCost = 0;

  const f1 = (event) => {
    setB1(true);
    handleFilter(event);
  };
  const f2 = (event) => {
    setB1(false);
    handleFilter(event);
  };

  const handleFilter = (event) => {
    a.setFilter(event.currentTarget);
  };

  const getamount = async () => {
    try {
      const response = await axios
        .get("http://localhost:4000/settle", {
          withCredentials: true,
        })
        .then((response) => {
          const { amount_spent, amount_received } = response.data;
          setSpent(amount_spent);
          setReceived(amount_received);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const summarizeTransactions = (transactions, setTotalCost) => {
    // Filter and sum costs of unsettled transactions
    const totalCost = transactions
      .filter((transaction) => !transaction.settled)
      .reduce((sum, transaction) => sum + parseFloat(transaction.cost), 0);

    // Update the totalCost state
    setTotalCost(totalCost);
  };

  useEffect(() => {
    async function loadTransactions() {
      const data = await fetchTransactions();
      setTransactions1(data.filter((data) => data.type === "borrowing"));
      setTransactions2(data.filter((data) => data.type === "lending"));
    }
    loadTransactions();
  }, [a.paidby, a.settleamount]); 

  useEffect(() => {
    const summarizedTransactions1 = summarizeTransactions(
      transactions1,
      setBorrowing
    );    
    const summarizedTransactions2 = summarizeTransactions(
      transactions2,
      setLending
    ); // Assuming you have setLending state for transactions2
    // setSummarizedTransactions2(summarizedTransactions2); // Assuming you have setSummarizedTransactions2 for the second set
  }, [transactions1, transactions2]);

  useEffect(() => {
    // console.log("calling after clicking");
    getamount();
    // console.log("552");    
  }, [a.paidby, a.settleamount]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <FormDialog text="Add an Expense" />
          <FormDialog text="Settle Up" />
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={borrowing}
            subtitle="You Owe"
            // progress="0.56"
            // increase="+14%"
            icon={
              <CurrencyRupeeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={lending}
            subtitle="You are Owed"
            // progress="0.50"
            // increase="+21%"
            icon={
              <CurrencyRupeeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={spent}
            subtitle="Total Spent"
            // progress="0.30"
            // increase="+5%"
            icon={
              <CurrencyRupeeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={received}
            subtitle="Total Received"
            // progress="0.80"
            // increase="+43%"
            icon={
              <CurrencyRupeeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Borrowings
            </Typography>
            <Box>
              <IconButton onClick={f1}>
                <FilterAltOutlinedIcon
                  sx={{
                    fontSize: "26px",
                    color: colors.greenAccent[500],
                    alignItems: "right",
                  }}
                />
              </IconButton>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
              {/* <Filter
                transactions={transactions1}
                setTransactions={setTransactions1}
              /> */}
            </Box>
          </Box>
          {transactions1.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              p="15px"
              color={colors.grey[100]}
              height="220px"
            >
              <h5 style={{}}>No Transactions</h5>
            </Box>
          ) : (
            transactions1.map((transaction, i) => (
              <Box
                key={`${transaction.txId}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box color={colors.grey[100]}>{transaction.date}</Box>
                <Box>
                  <h5 style={{ display: "inline", margin: "0px 7px", color: colors.grey[100] }}>You owe</h5>
                  <h6 style={{ margin: "0", display: "inline", color: colors.grey[100] }}>{transaction.paidby}</h6>
                </Box>
                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                  sx={{
                    textDecoration: transaction.settled
                      ? "line-through"
                      : "none",
                    textDecorationColor: transaction.settled
                      ? "black"
                      : "transparent",
                  }}
                >
                  ₹{transaction.cost}
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Lendings
            </Typography>
            <Box>
              <IconButton onClick={f2}>
                <FilterAltOutlinedIcon
                  sx={{
                    fontSize: "26px",
                    color: colors.greenAccent[500],
                    alignItems: "right",
                  }}
                />
              </IconButton>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
              {b1 ? (
                <Filter
                  transactions={transactions1}
                  setTransactions={setTransactions1}
                />
              ) : (
                <Filter
                  transactions={transactions2}
                  setTransactions={setTransactions2}
                />
              )}
            </Box>
          </Box>
          {transactions2.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              p="15px"
              color={colors.grey[100]}
              height="220px"
            >
              <h5>No transactions</h5>
            </Box>
          ) : (
            transactions2.map((transaction, i) => (
              <Box
                key={`${transaction.txId}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box color={colors.grey[100]}>{transaction.date}</Box>
                {/* According to the warning, you cannot have <h6> inside <p>, which is the default HTML element for Typography. This is causing the error:
                  Warning: validateDOMNesting(...): <h6> cannot appear as a descendant of <p>. */}
                <Box>
                  <h5 style={{ display: "inline", margin: "0px 7px", color: colors.grey[100] }}>{transaction.receiver}</h5>
                  <h6 style={{ margin: "0", display: "inline", color: colors.grey[100] }}>owes You</h6>
                </Box>
                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                  sx={{
                    textDecoration: transaction.settled
                      ? "line-through"
                      : "none",
                    textDecorationColor: transaction.settled
                      ? "black"
                      : "transparent",
                  }}
                >
                  ₹{transaction.cost}
                </Box>
              </Box>
            ))
          )}
        </Box>
        {/* ROW 3 */}
      </Box>
    </Box>
  );
};

export default Dashboard;

