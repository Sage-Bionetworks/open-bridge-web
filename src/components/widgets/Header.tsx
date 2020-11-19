import React, { FunctionComponent, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { Dialog, DialogContent, Paper } from '@material-ui/core'
import AccountLogin from './../account/AccountLogin'

import Logout from '../account/Logout'
import Logo from '../../assets/logo_mtb.svg'
import { NavLink } from 'react-router-dom'
import { latoFont } from '../../style/theme'

const useStyles = makeStyles(theme => ({
  toolbarWrapper: {
    height: '104px',
    display: 'flex',
    borderBottom: '1px solid #EAEAEA',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  toolbar: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    justifyContent: 'space-between',
    overflowX: 'auto',
    minHeight: '40px',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    textDecoration: 'none',

    flexShrink: 0,
    //agendel todo Lato
    fontFamily: latoFont,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    color: '#393434',
  },
  selectedLink: {
    fontWeight: 'bold',
    color: '#393434;',
  },
  login: {
borderLeft: '1px solid #EAEAEA',
paddingLeft: theme.spacing(2),
marginLeft: theme.spacing(2),
marginTop: theme.spacing(-4),
paddingTop: theme.spacing(4),
paddingBottom: theme.spacing(4),
marginBottom: theme.spacing(-4),
  }
}))

type HeaderProps = {
  routes: { name: string; path: string; isRhs?: boolean }[]

  token?: string
}

const Header: FunctionComponent<HeaderProps> = ({
  routes,

  token,
  ...props
}: HeaderProps) => {
  const classes = useStyles()
  //const sessionData = useSessionDataState()
  const [signInOpen, setSignInOpen] = useState(false)

  return (
    <Paper className={classes.toolbarWrapper} elevation={0}>
    
        <img src={Logo} key="Mobile Toolbox"  className={classes.toolbar}/>
        <Toolbar
        component="nav"
        variant="dense"
        disableGutters
        className={classes.toolbar}
      >
        {routes
          .filter(route => route.name && !route.isRhs)
          .map(route => (
            <NavLink
              to={route.path}
              key={route.name}
              className={classes.toolbarLink}
              activeClassName={classes.selectedLink}
            >
              {route.name}
            </NavLink>
          ))}
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
      
        disableGutters
        className={classes.toolbar}
      >
        {token ? (
          <div className={classes.login}>
          <Logout></Logout>
          </div>
        ) : (
          <>
            {routes
              .filter(route => route.name && route.isRhs)
              .map(route => (
                <NavLink
                  to={route.path}
                  key={route.name}
                  className={classes.toolbarLink}
                  activeClassName={classes.selectedLink}
                >
                  {route.name}
                </NavLink>
              ))}
              <div className={classes.login}>
            <Button
              variant="text"
            className={classes.toolbarLink}
              onClick={() => setSignInOpen(true)}
            >
              Sign in
            </Button>
            </div>
          </>
        )}
      </Toolbar>
      <Dialog
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <AccountLogin
            {...props}
            callbackFn={() => setSignInOpen(false)}
          ></AccountLogin>
        </DialogContent>
      </Dialog>
    </Paper>
  )
}

export default Header
