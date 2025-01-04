import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import OCRComponent from "./scenes/invoices";
import Form from "./scenes/form";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import "../src/app.css"; // Adjust the path as necessary
import TransactionState from "./context/Transaction/TransactionState";
import Register from "./components/Register";
import Login from "./components/Login";


function App() {
  const [theme, colorMode] = useMode();
  const isAuthenticated = window.localStorage.getItem("isAuthenticated");
  const location = useLocation(); // Get the current route location

  
  // Function to check if the current location matches certain paths
  const shouldShowSidebarAndTopbar = () => {
    const { pathname } = location;
    return isAuthenticated && !['/login', '/register'].includes(pathname);
  };

  return (
    <TransactionState>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {shouldShowSidebarAndTopbar() && <Sidebar className="sidebar" />}
            <main className="content">
              {shouldShowSidebarAndTopbar() && <Topbar />}
              <Routes>
                <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/Dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/Dashboard/invoices" element={isAuthenticated ? <OCRComponent /> : <Navigate to="/login" />} />
                <Route path="/Dashboard/form" element={isAuthenticated ? <Form /> : <Navigate to ="/login" />} /> ``
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </TransactionState>
  );
}

export default App;
