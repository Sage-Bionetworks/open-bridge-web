import {
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu'
import clsx from 'clsx'
import React, {FunctionComponent, useState} from 'react'
import {NavLink} from 'react-router-dom'
import Logo from '../../assets/logo_mtb.svg'
import {latoFont} from '../../style/theme'
import {UserSessionData} from '../../types/types'
import AccountLogin from '../account/AccountLogin'
import Logout from '../account/Logout'
import MobileDrawerMenuHeader from './MobileDrawerMenuHeader'

const drawerWidth = '320px'

const useStyles = makeStyles(theme => ({
  toolbarWrapper: {
    height: '104px',
    display: 'flex',
    borderBottom: '1px solid #EAEAEA',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 3),
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
    fontFamily: latoFont,
    fontSize: '15px',
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
    height: '56px',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(3),
    '&:hover': {
      backgroundColor: '#fff',
    },
    display: 'flex',
    alignItems: 'center',
    borderLeft: '4px solid transparent',
  },
  drawerMenuSelectedLink: {
    borderLeft: '4px solid #353535',
    fontWeight: 'bold',
  },
  drawerMenuSeparator: {
    height: '2px',
    margin: '20px 0px',
    backgroundColor: '#2A2A2A',
  },

  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#F8F8F8',
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
  createAccountLink: {
    marginTop: theme.spacing(7),
    borderBottom: '1px solid #EAEAEA',
  },
  drawerAuthOptions: {
    justifyContent: 'flex-start',
    height: '56px',
    textTransform: 'uppercase',
  },
  drawerProfileOptions: {
    justifyContent: 'flex-start',
    height: '56px',
  },
  divider: {
    border: '1px solid #EAEAEA',
    width: '100%',
    marginTop: theme.spacing(3.5),
    marginBottom: theme.spacing(3.5),
  },
}))

type AppTopNavProps = {
  routes: {name: string; path: string; isRhs?: boolean}[]
  appId: string
  sessionData?: UserSessionData
}

const MenuLinks: FunctionComponent<
  AppTopNavProps & {
    className: string
    activeClassName: string
    setIsMobileOpen: Function
  }
> = ({routes, className, activeClassName, setIsMobileOpen}) => {
  let links = routes.map(route => (
    <NavLink
      to={route.path}
      key={route.name}
      className={className}
      activeClassName={activeClassName}
      onClick={() => setIsMobileOpen(false)}>
      {route.name}
    </NavLink>
  ))

  return <>{links}</>
}

const MenuLinksRhs: FunctionComponent<
  AppTopNavProps & {
    className: string
    activeClassName: string
    isRightHandSide?: boolean
    setIsMobileOpen: Function
  }
> = ({
  routes,
  sessionData,
  className,
  activeClassName,
  children,
  isRightHandSide,
  setIsMobileOpen,
}) => {
  const classes = useStyles()

  function getClassName(routeName: String, isRightHandSide: boolean) {
    if (!isRightHandSide) return className
    if (routeName === 'CREATE ACCOUNT') {
      return clsx(
        className,
        classes.drawerAuthOptions,
        classes.createAccountLink
      )
    }
    if (routeName === 'Edit Profile' || routeName === 'Settings') {
      return clsx(className, classes.drawerProfileOptions)
    }
    return className
  }

  let links: React.ReactNode[] = routes.map(route => (
    <NavLink
      to={route.path}
      key={`rhs_${route.name}`}
      className={getClassName(route.name, isRightHandSide || false)}
      activeClassName={activeClassName}
      onClick={() => setIsMobileOpen(false)}>
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
  appId,
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
        1
      )}${sessionData.lastName?.substr(0, 1)}`
    }
    return initial?.toUpperCase() || '?'
  }
  // Hide the app store download page from the nav.
  routes = routes.filter(route => route.name !== 'APP STORE')
  return (
    <>
      {' '}
      <Hidden lgUp>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="end"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={classes.menuButton}>
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
            className={classes.toolbar}>
            <MenuLinks
              appId={appId}
              className={classes.toolbarLink}
              activeClassName={classes.selectedLink}
              routes={routes.filter(route => route.name && !route.isRhs)}
              setIsMobileOpen={setIsMobileOpen}
            />
          </Toolbar>
          <Toolbar
            component="nav"
            variant="dense"
            disableGutters
            className={classes.toolbar}>
            {!sessionData && (
              <MenuLinksRhs
                appId={appId}
                className={classes.toolbarLink}
                activeClassName={classes.selectedLink}
                routes={routes.filter(route => route.name && route.isRhs)}
                sessionData={sessionData}
                setIsMobileOpen={setIsMobileOpen}>
                <></>
                <div className={classes.login}>
                  <Button
                    variant="text"
                    className={classes.toolbarLink}
                    onClick={() => setIsSignInOpen(true)}>
                    Sign in
                  </Button>
                </div>
              </MenuLinksRhs>
            )}
            {sessionData && (
              <div
                onClick={event => setMenuAnchor(event.currentTarget)}
                style={{paddingLeft: '8px'}}>
                <div
                  className={clsx(
                    classes.userCircle,
                    !!menuAnchor && classes.userCircleActive
                  )}>
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
          }}>
          <MobileDrawerMenuHeader
            setIsMobileOpen={setIsMobileOpen}
            type={
              sessionData ? 'LOGGED_IN' : 'NOT_LOGGED_IN'
            }></MobileDrawerMenuHeader>
          <MenuLinks
            appId={appId}
            className={classes.drawerMenuItem}
            activeClassName={classes.drawerMenuSelectedLink}
            routes={routes.filter(route => route.name && !route.isRhs)}
            setIsMobileOpen={setIsMobileOpen}
          />
          {sessionData && <Divider className={classes.divider}></Divider>}
          <MenuLinksRhs
            appId={appId}
            className={classes.drawerMenuItem}
            activeClassName={classes.drawerMenuSelectedLink}
            routes={routes.filter(route => route.name && route.isRhs)}
            sessionData={sessionData}
            isRightHandSide={true}
            setIsMobileOpen={setIsMobileOpen}>
            <Logout
              element={
                <Button
                  variant="text"
                  className={clsx(
                    classes.drawerMenuItem,
                    classes.drawerProfileOptions
                  )}>
                  Sign out
                </Button>
              }></Logout>
            <Button
              variant="text"
              className={clsx(
                classes.drawerAuthOptions,
                classes.drawerMenuItem
              )}
              onClick={() => setIsSignInOpen(true)}>
              Login
            </Button>
          </MenuLinksRhs>
        </Drawer>
      </nav>
      <Dialog
        open={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        aria-labelledby="form-dialog-title">
        <DialogContent>
          <AccountLogin
            {...props}
            callbackFn={() => setIsSignInOpen(false)}></AccountLogin>
        </DialogContent>
      </Dialog>
      <Menu
        classes={{list: classes.l}}
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
        onClose={handleMenuClose}>
        {routes
          .filter(r => r.isRhs)
          .map(route => (
            <MenuItem key={route.name}>
              <NavLink to={route.path}>{route.name}</NavLink>
            </MenuItem>
          ))}

        <MenuItem key={'logout'}>
          <Logout element={<div>Log out</div>}></Logout>
        </MenuItem>
      </Menu>
    </>
  )
}

export default AppTopNav
