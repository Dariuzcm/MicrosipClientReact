import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';
import { AppBar, Box, Menu, MenuItem, Toolbar, Tooltip } from '@material-ui/core';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../Models/Users/UsersSlice';
import { RootState } from '../store';


export default function ButtonAppBar() {

  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((reduxState: RootState) => reduxState).users.currentUser;
 const handleClose = () => {
    dispatch(logOut())
  };

  const navigation = router.pathname;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {navigation === '/' ? 'Administración de Articulos': navigation}
          </Typography>
          <div style={{display: 'flex', alignItems: 'center'}}>
          <Typography variant="caption" component="div" sx={{ flexGrow: 1 }}>
            {user && user.name}
          </Typography>
            <Tooltip title={'Desconectar'}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClose}
                color="inherit"
                >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
