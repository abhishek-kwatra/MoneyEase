import axios from "axios";

// Function to format date as "10 Aug"
function formatDate(dateString) {
  const date = new Date(dateString);

  // Handle invalid date
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return 'Invalid Date';
  }

  // Extract day and month in local time
  const day = date.getDate(); // Use getDate() for local day
  const month = date.toLocaleString('en-GB', { month: 'short' }); // Get the abbreviated month

  return `${day} ${month}`;
}

// Fetch and format transactions from the backend
export async function fetchTransactions() {
  try {
    const response = await axios.get(
      "http://localhost:4000/get_transaction",
      { withCredentials: true }
    );  
    // console.log(response.data);      
    return response.data.map((transaction) => ({
      txId: transaction.transaction_message.txId,
      paidby: transaction.paid_by_username,
      receiver: transaction.receiver,
      date: formatDate(transaction.created_at),
      cost: transaction.amount,
      message: transaction.transaction_message,
      type: transaction.transaction_type,
      settled: transaction.settled,
      // receiver_userinfo: transaction.Receiver_username,
      // borrower_userinfo: transaction.borrower_username
    }));
  } catch (err) {
    console.error("Error fetching data in the dashboard", err);
    return []; // Return an empty array if there's an error
  }
}

export const mockTransactions = [
  {
    txId: "01e4dsa",
    user: "johndoe",
    date: "1 Jan",
    cost: "43.95",
  },
  // Add more mock transactions here if needed
];
