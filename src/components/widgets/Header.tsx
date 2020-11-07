import React, { FunctionComponent, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import { Box, Dialog, DialogContent, Paper } from '@material-ui/core'
import AccountLogin from './../account/AccountLogin'
import { useSessionDataState } from '../../helpers/AuthContext'
import Logout from '../account/Logout'
import SageLogo from '../../assets/sage.svg'
import { NavLink, BrowserRouter as Router } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  toolbarWrapper: {
    padding: `${theme.spacing(7)}px ${theme.spacing(5)}px  ${theme.spacing(
      3,
    )}px ${theme.spacing(5)}px`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbar: {
    justifyContent: 'space-between',
    overflowX: 'auto',

    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarLink: {
    padding: theme.spacing(1),
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
  },
  selectedLink: {
    borderBottom: '2px solid black',
  },
}))

type HeaderProps = {
  sections: { name: string; path: string }[]
  title: string
  token?: string
}

const Header: FunctionComponent<HeaderProps> = ({
  sections,
  title,
  token,
  ...props
}: HeaderProps) => {
  const classes = useStyles()
  //const sessionData = useSessionDataState()
  const [signInOpen, setSignInOpen] = useState(false)

  return (
    <Paper className={classes.toolbarWrapper} elevation={0}>
      <Toolbar
        component="nav"
        variant="dense"
        disableGutters
        className={classes.toolbar}
      >
        <img src={SageLogo} key="x" />
        {sections
          .filter(section => section.name)
          .map(section => (
       
              <NavLink
                to={section.path}
                key={section.name + '1'}
                className={classes.toolbarLink}
                activeClassName={classes.selectedLink}
              >
                {section.name}
              </NavLink>
       
          ))}
        {token ? (
          <Logout></Logout>
        ) : (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSignInOpen(true)}
          >
            Sign in
          </Button>
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
