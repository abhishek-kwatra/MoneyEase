import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
import transactionContext from "../../context/Transaction/TransactionContext";
import Menu from "../menu/menu";
import { PersonAddAlt1, GroupAdd } from "@mui/icons-material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Notification from "../menu/notifications";
import Profile from "../menu/profile";
import GroupMenu from "../menu/group"
import Friendmenu from "../menu/friend"
import menu from "../menu/menu"

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const a = useContext(transactionContext);

  const friend = (event) => {
    a.setAnchorEl(event.currentTarget);
  };
  const handleNotification = (event) => {
    a.setShownotifications(event.currentTarget);
  };
  const handleProfile = (event) => {
    a.setProfile(event.currentTarget);
  };

  const handleFriend = (event) =>{
    a.setFriendmenu(event.currentTarget)
  }

  const handleGroup = (event) => {
    a.setGroup(event.currentTarget);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleNotification}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <Notification />
        <IconButton onClick={handleProfile}>
          <SettingsOutlinedIcon />
        </IconButton>
        <Profile />
        <IconButton onClick={handleFriend}>
          <PersonAddAlt1/>
        </IconButton>
        <Friendmenu/>
        <IconButton onClick={handleGroup}>
          {/* <CustomIcon /> */}
          <GroupAdd/>
        </IconButton>
        <GroupMenu/>        
      </Box>
    </Box>
  );
};

export default Topbar;
