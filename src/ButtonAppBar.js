import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Toolbar, Typography, Menu, MenuItem, Divider, SvgIcon } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { ReactComponent as Logo } from './imgs/postgresql.svg';

const useStyles = makeStyles((theme) => ({
  flex: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(1) },
}));

export default function ButtonAppBar({onAct}) {
  const classes = useStyles();
	const [menuEl, setMenuEl] = React.useState(null);

  return (
    <div className={classes.flex}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={(event)=>setMenuEl(event.currentTarget)}>
            <MenuIcon />
          </IconButton>
					<Menu anchorEl={menuEl} keepMounted open={Boolean(menuEl)} onClose={()=>setMenuEl(null)}>
						<MenuItem onClick={()=>{ setMenuEl(null); onAct('refr'); }}>Refresh</MenuItem>
						<MenuItem label="Add" onClick={()=>{ setMenuEl(null); onAct('add'); }}>Add</MenuItem>
						<Divider light />
						<MenuItem onClick={()=>{ setMenuEl(null); onAct('out'); }}>Logout</MenuItem>
					</Menu>
          <Typography variant="h6" className={classes.flex}>
            Alex's Staff
          </Typography>
					<SvgIcon><Logo/></SvgIcon>					
        </Toolbar>
      </AppBar>
    </div>
  );
}