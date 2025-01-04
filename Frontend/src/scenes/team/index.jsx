import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from "axios";
import * as React from "react";
import FormDialog from "../DialogForm/grouptrans";
import FormDialog1 from "../DialogForm/groupus";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [groups, setGroups] = React.useState([]);
  const getGroups = async () => {
    const response = await axios.get(`http://localhost:4000/get_groups`, {
      withCredentials: true,
    });
    const dataWithId = response.data.map((item, index) => ({
      function1: "Show Transactions",
      function2: "Show Users",
      id: index + 1, // Assign a unique id based on the index
      ...item,
    }));
    return dataWithId;
  };
  const getGroupMember = async () => {
    const response = await axios.get(
      `http://localhost:4000/get_group_members`,
      {
        params: { group_id: groups[0].group_id },
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  };
  const getGroupExpenses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/get_group_expenses`,
        {
          params: { group_id: groups[0].group_id },
          withCredentials: true,
        }
      );
      const newData = response.data.map((item, index) => {
        return {
          id: index + 1,
          ...item,
        };
      });      
      return newData;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();
    console.log("Got Clicked");
    const group_member = await getGroupMember();
    const group_expenses = await getGroupExpenses();
    console.log(group_expenses);
  };

  React.useEffect(() => {
    getGroups().then(setGroups);
  }, []);

  // const columns2 = [
  //   { field: "id", headerName: "ID" },
  //   {
  //     field: "expense_date",
  //     headerName: "Group Name",
  //     flex: 1,
  //     cellClassName: "name-column--cell",
  //   },
  //   {
  //     field: "paid_by",
  //     headerName: "Created By",
  //     type: "number",
  //     headerAlign: "left",
  //     align: "left",
  //   },

  //   {
  //     field: "descpription",
  //     headerName: "description",
  //     flex: 1,
  //   },
  //   {
  //     field: "amount",
  //     headerName: "description",
  //     flex: 1,
  //   },
  // ];
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "group_name",
      headerName: "Group Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "created_by",
      headerName: "Created By",
      type: "number",
      headerAlign: "left",
      align: "left",
    },

    {
      field: "functionLevel1",
      headerName: "",
      flex: 1,
      renderCell: ({ row}) => {
        const {function1, group_id} = row;
        return (
          <Box
            width="60%"
            m="8px auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              function1 === "admin"
                ? colors.greenAccent[600]
                : function1 === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {function1 === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {function1 === "manager" && <SecurityOutlinedIcon />}
            {function1 === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                <FormDialog text ={function1} groupId={group_id}></FormDialog>
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "functionLevel",
      headerName: "",
      flex: 1,
      renderCell: ({ row }) => {
        const{function2, group_id} = row;
        return (
          <Box
            width="60%"
            m="8px auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              function2 === "admin"
                ? colors.greenAccent[600]
                : function2 === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {function2 === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {function2 === "manager" && <SecurityOutlinedIcon />}
            {function2 === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {/* {function2}; */}
              <FormDialog1 text ={function2} groupId={group_id}></FormDialog1>
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid rows={groups} columns={columns} />
        {/* <DataGrid rows={groups} columns={columns2} /> */}
      </Box>
    </Box>
  );
};
export default Team;

{
  /* <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} /> */
}


