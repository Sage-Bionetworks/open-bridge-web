import React, { FunctionComponent, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import { Dialog, DialogContent } from '@material-ui/core'
import AccountLogin from './../account/AccountLogin'
import { useSessionDataState } from '../../helpers/AuthContext'
import Logout from '../account/Logout'

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}))

type HeaderProps = {
  sections: { name: string; path: string }[]
  title: string
}

const Header: FunctionComponent<HeaderProps> = ({
  sections,
  title,
  ...props
}: HeaderProps) => {
  const classes = useStyles()
  const sessionData = useSessionDataState()
  const [signInOpen, setSignInOpen] = useState(false)

  return (
    <React.Fragment>
      <Toolbar
        component="nav"
        variant="dense"
        disableGutters
        className={classes.toolbarSecondary}
      >
        {sections.filter(section=> section.name).map(section => (
          <Link
            color="inherit"
            noWrap
            key={section.name}
            variant="body2"
            href={section.path}
            className={classes.toolbarLink}
          >
            {section.name}
          </Link>
        ))}
        {!sessionData.token && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSignInOpen(true)}
          >
            Sign in
          </Button>
        )}

        {sessionData.token && <Logout></Logout>}
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
    </React.Fragment>
  )
}

export default Header
