import {
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  Paper
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu'
import clsx from 'clsx'
import React, { FunctionComponent, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../../assets/logo_mtb.svg'
import { latoFont } from '../../style/theme'
import { UserSessionData } from '../../types/types'
import AccountLogin from '../account/AccountLogin'
import Logout from '../account/Logout'

const drawerWidth = '285px'

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
    padding: theme.spacing(4, 2),
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
  menuButton: {
    marginRight: theme.spacing(2),
    float: 'right',
    '&::after': {
      content: '',
      display: 'table',
      clear: 'both',
    },
  },
  login: {
    borderLeft: '1px solid #EAEAEA',
    padding: theme.spacing(4, 2),
    margin: theme.spacing(-4, 0, -4, 2),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerMenuItem: {
    textDecoration: 'none',

    flexShrink: 0,
    fontFamily: latoFont,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    color: '#393434',
    padding: theme.spacing(1.5, 0, 1.5, 5),
  },
  drawerMenuSeparator: {
    height: '2px',
    margin: '20px 0px',
    backgroundColor: '#2A2A2A',
  },

  drawerPaper: {
    width: drawerWidth,
  },

  l: {
    backgroundColor: '#F3F3EC',
    padding: 0,

    '& li': {
      padding: theme.spacing(2),
    },
    '& a, & a:hover,  & a:visited, & a:active': {
      textDecoration: 'none',
      color: '#000',
    },

    '& li:hover': {
      backgroundColor: '#fff',
    },
  },
  userCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    fontFamily: latoFont,
    cursor: 'pointer',
    backgroundColor: '#F3F3EC',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    '&:hover, &:active': {
      border: '1px solid black',
    },
    '&$userCircleActive': {
      border: '1px solid black',
    },
  },
  userCircleActive: {},
}))

type AppTopNavProps = {
  routes: { name: string; path: string; isRhs?: boolean }[]
  sessionData?: UserSessionData
}

const MenuLinks: FunctionComponent<
  AppTopNavProps & {
    className: string
    activeClassName: string
  }
> = ({ routes, className, activeClassName }) => {
  let links = routes.map(route => (
    <NavLink
      to={route.path}
      key={route.name}
      className={className}
      activeClassName={activeClassName}
    >
      {route.name}
    </NavLink>
  ))

  return <>{links}</>
}

const MenuLinksRhs: FunctionComponent<
  AppTopNavProps & {
    className: string
    activeClassName: string
  }
> = ({ routes, sessionData, className, activeClassName, children }) => {
  const classes = useStyles()

  let links: React.ReactNode[] = routes.map(route => (
    <NavLink
      to={route.path}
      key={route.name}
      className={className}
      activeClassName={activeClassName}
    >
      {route.name}
    </NavLink>
  ))
  if (Array.isArray(children)) {
    if (sessionData?.token) {
      links.push(children[0])
    } else {
      links.push(children[1])
    }
  }

  return <>{links}</>
}

const AppTopNav: FunctionComponent<AppTopNavProps> = ({
  routes,

  sessionData,
  ...props
}: AppTopNavProps) => {
  const classes = useStyles()

  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const getInitials = () => {
    if (!sessionData) {
      return '?'
    }
    let initial = sessionData.userName?.substr(0, 1)
    if (sessionData.firstName) {
      initial = `${sessionData.firstName.substr(
        0,
        1,
      )}${sessionData.lastName?.substr(0, 1)}`
    }
    return initial?.toUpperCase() || '?'
  }

  return (
    <>
      {' '}
      <Hidden lgUp>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="end"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={classes.menuButton}
        >
          <MenuIcon></MenuIcon>
        </IconButton>
      </Hidden>
      <Hidden mdDown>
        <Paper className={classes.toolbarWrapper} elevation={0}>
          <img
            src={Logo}
            key="Mobile Toolbox"
            className={classes.toolbar}
            alt="logo"
          />
          <Toolbar
            component="nav"
            variant="dense"
            disableGutters
            className={classes.toolbar}
          >
            <MenuLinks
              className={classes.toolbarLink}
              activeClassName={classes.selectedLink}
              routes={routes.filter(route => route.name && !route.isRhs)}
            />
          </Toolbar>
          <Toolbar
            component="nav"
            variant="dense"
            disableGutters
            className={classes.toolbar}
          >
            {!sessionData && (
              <MenuLinksRhs
                className={classes.toolbarLink}
                activeClassName={classes.selectedLink}
                routes={routes.filter(route => route.name && route.isRhs)}
                sessionData={sessionData}
              >
                <></>
                <div className={classes.login}>
                  <Button
                    variant="text"
                    className={classes.toolbarLink}
                    onClick={() => setIsSignInOpen(true)}
                  >
                    Sign in
                  </Button>
                </div>
              </MenuLinksRhs>
            )}
            {sessionData && (
              <div
                onClick={event => setMenuAnchor(event.currentTarget)}
                style={{ paddingLeft: '8px' }}
              >
                <div
                  className={clsx(
                    classes.userCircle,
                    !!menuAnchor && classes.userCircleActive,
                  )}
                >
                  {getInitials()}
                </div>
              </div>
            )}
          </Toolbar>
        </Paper>
      </Hidden>
      <nav className={classes.drawer}>
        <Drawer
          variant="temporary"
          anchor="right"
          open={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <MenuLinks
            className={classes.drawerMenuItem}
            activeClassName={classes.selectedLink}
            routes={routes.filter(route => route.name && !route.isRhs)}
          />

          <Divider className={classes.drawerMenuSeparator} />

          <MenuLinksRhs
            className={classes.drawerMenuItem}
            activeClassName={classes.selectedLink}
            routes={routes.filter(route => route.name && route.isRhs)}
            sessionData={sessionData}
          >
            <div className={classes.drawerMenuItem}>
              <Logout
                element={
                  <Button
                    variant="text"
                    className={classes.drawerMenuItem}
                    style={{
                      paddingLeft: '0',
                      backgroundColor: 'transparent',
                    }}
                  >
                    Log out
                  </Button>
                }
              ></Logout>
            </div>
            <div className={classes.drawerMenuItem}>
              <Button
                variant="text"
                className={classes.drawerMenuItem}
                onClick={() => setIsSignInOpen(true)}
                style={{
                  paddingLeft: '0',
                  backgroundColor: 'transparent',
                }}
              >
                Sign in
              </Button>
            </div>
          </MenuLinksRhs>
        </Drawer>
      </nav>
      <Dialog
        open={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <AccountLogin
            {...props}
            callbackFn={() => setIsSignInOpen(false)}
          ></AccountLogin>
        </DialogContent>
      </Dialog>
      <Menu
        classes={{ list: classes.l }}
        id="simple-menu"
        anchorEl={menuAnchor}
        keepMounted
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {routes
          .filter(r => r.isRhs)
          .map(route => (
            <MenuItem>
              <NavLink to={route.path} key={route.name}>
                {route.name}
              </NavLink>
            </MenuItem>
          ))}

        <MenuItem>
          <Logout element={<div>Log out</div>}></Logout>
        </MenuItem>
      </Menu>
    </>
  )
}

export default AppTopNav
