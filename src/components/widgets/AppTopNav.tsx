import LogoLarge from '@assets/logo_mtb_large.svg'
import Logo from '@assets/logo_mtb_small.svg'
import useFeatureToggles, {FeatureToggles} from '@helpers/FeatureToggle'
import MenuIcon from '@mui/icons-material/Menu'
import {Box, Divider, Drawer, Hidden, IconButton, Menu, MenuItem, styled, Toolbar} from '@mui/material'
import Button from '@mui/material/Button'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import {NavRouteType, UserSessionData} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {useLocation} from 'react-router'
import {NavLink} from 'react-router-dom'
import Logout from '../account/Logout'
import MobileDrawerMenuHeader from './MobileDrawerMenuHeader'

const drawerWidth = '320px'

const StyledAppNav = styled(Box, {label: 'StyledAppTopNav', shouldForwardProp: prop => prop !== 'hasSubNav'})<{
  hasSubNav?: boolean
}>(({theme, hasSubNav}) => ({
  height: hasSubNav ? 'auto' : '122px',

  borderBottom: '1px solid #EAECEE',
  padding: hasSubNav ? theme.spacing(0, 4) : theme.spacing(0, 5),
  '&  div.first-of-type': {
    display: 'flex',

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}))
const StyledToolBar = styled(Toolbar, {label: 'StyledToolBar', shouldForwardProp: prop => prop !== 'hasSubNav'})<{
  hasSubNav?: boolean
}>(({theme, hasSubNav}) => ({
  padding: hasSubNav ? theme.spacing(3, 2) : theme.spacing(4, 2),
  justifyContent: 'space-between',
  overflowX: 'auto',
  minHeight: '40px',
}))

const StyledToolBarLink = styled(NavLink, {label: 'StyledToolBarLink'})(({theme}) => ({
  padding: theme.spacing(1),
  textDecoration: 'none',

  flexShrink: 0,
  //agendel todo Lato
  fontFamily: latoFont,
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '18px',
  color: '#353A3F',
}))

const useStyles = makeStyles(theme => ({
  selectedLink: {},
  menuButton: {
    marginRight: theme.spacing(2),
    float: 'right',
    '&::after': {
      content: '',
      display: 'table',
      clear: 'both',
    },
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

    '&$drawerProfileOptionsDisabled:hover': {
      backgroundColor: 'inherit',
      cursor: 'default',
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
  drawerProfileOptionsDisabled: {
    justifyContent: 'flex-start',
    height: '56px',
    opacity: 0.5,
  },
  divider: {
    border: '1px solid #EAEAEA',
    width: '100%',
    marginTop: theme.spacing(3.5),
    marginBottom: theme.spacing(3.5),
  },
}))

type AppTopNavProps = {
  hasSubNav?: boolean
  routes: NavRouteType[]
  appId: string
  sessionData?: UserSessionData
  children?: React.ReactNode
}

const MenuLinks: FunctionComponent<
  AppTopNavProps & {
    setIsMobileOpen: Function
  }
> = ({routes, setIsMobileOpen}) => {
  let links = routes.map(route => (
    <StyledToolBarLink
      to={route.path}
      key={route.name}
      activeStyle={{
        fontWeight: 800,
        color: '#4F527D',
      }}
      onClick={() => setIsMobileOpen(false)}>
      {route.name}
    </StyledToolBarLink>
  ))

  return <>{links}</>
}

const MenuLinksRhs: FunctionComponent<
  AppTopNavProps & {
    isRightHandSide?: boolean
    setIsMobileOpen: Function
  }
> = ({routes, sessionData, children, isRightHandSide, setIsMobileOpen}) => {
  const classes = useStyles()

  /*function getClassName(routeName: String, isRightHandSide: boolean) {
    if (!isRightHandSide) return className
    if (routeName === 'CREATE ACCOUNT') {
      return clsx(className, classes.drawerAuthOptions, classes.createAccountLink)
    }
    if (routeName === 'Edit Profile' || routeName === 'Settings') {
      return clsx(className, classes.drawerProfileOptionsDisabled)
    }
    return className
  }*/

  let links: React.ReactNode[] = routes.map(route => {
    return (
      <StyledToolBarLink
        to={route.path}
        key={`rhs_${route.name}`}
        activeStyle={{
          fontWeight: 800,
          color: '#4F527D',
        }}
        onClick={() => setIsMobileOpen(false)}>
        {route.name}
      </StyledToolBarLink>
    )
  })
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
  hasSubNav,
  children,
  ...props
}: AppTopNavProps) => {
  const classes = useStyles()
  const location = useLocation()

  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const toggle = useFeatureToggles<FeatureToggles>()

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const getInitials = () => {
    if (!sessionData) {
      return '?'
    }
    let initial = sessionData.userName?.substr(0, 1)
    if (sessionData.firstName) {
      initial = `${sessionData.firstName.substr(0, 1)}${sessionData.lastName?.substr(0, 1)}`
    }
    return initial?.toUpperCase() || '?'
  }
  // Hide the app store download page and also the sign in page from the nav.
  routes = routes.filter(
    route => route.name !== 'APP STORE' && route.name !== 'SIGN IN' && (!route.toggle || toggle[route.toggle!] === true)
  )

  const isLoginButtonDisabled = React.useMemo(() => {
    return location.pathname.endsWith('/sign-in')
  }, [location])

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
          size="large">
          <MenuIcon></MenuIcon>
        </IconButton>
      </Hidden>
      <Hidden lgDown>
        <StyledAppNav hasSubNav={hasSubNav}>
          <Box
            sx={{
              display: 'flex',

              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {sessionData?.token ? (
              <NavLink to="/studies">
                <img src={hasSubNav ? Logo : LogoLarge} key="Mobile Toolbox" alt="logo" />
              </NavLink>
            ) : (
              <img src={hasSubNav ? Logo : LogoLarge} key="Mobile Toolbox" alt="logo" />
            )}

            <Box sx={{display: 'flex'}}>
              <StyledToolBar disableGutters hasSubNav={hasSubNav}>
                <MenuLinks
                  appId={appId}
                  routes={routes.filter(route => route.name && !route.isRhs)}
                  setIsMobileOpen={setIsMobileOpen}
                />
              </StyledToolBar>
              <StyledToolBar disableGutters hasSubNav={hasSubNav}>
                {!sessionData && (
                  <MenuLinksRhs
                    appId={appId}
                    routes={routes.filter(route => route.name && route.isRhs)}
                    sessionData={sessionData}
                    setIsMobileOpen={setIsMobileOpen}>
                    <></>
                    {window.location.pathname !== '/' && (
                      <div>
                        <Button
                          disabled={isLoginButtonDisabled}
                          variant="text"
                          sx={{fontSize: '15px', lineHeight: '18px', color: '#393434'}}
                          href={'/sign-in'}>
                          LOG IN
                        </Button>
                      </div>
                    )}
                  </MenuLinksRhs>
                )}
                {sessionData && (
                  <div onClick={event => setMenuAnchor(event.currentTarget)} style={{paddingLeft: '8px'}}>
                    <div className={clsx(classes.userCircle, !!menuAnchor && classes.userCircleActive)}>
                      {getInitials()}
                    </div>
                  </div>
                )}
              </StyledToolBar>
            </Box>
          </Box>
          {children}
        </StyledAppNav>
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
            type={sessionData ? 'LOGGED_IN' : 'NOT_LOGGED_IN'}></MobileDrawerMenuHeader>
          <MenuLinks
            appId={appId}
            //  className={classes.drawerMenuItem}

            routes={routes.filter(route => route.name && !route.isRhs)}
            setIsMobileOpen={setIsMobileOpen}
          />
          {sessionData && <Divider className={classes.divider}></Divider>}
          {children && (
            <>
              {children}
              <Divider className={classes.divider}></Divider>
            </>
          )}
          <MenuLinksRhs
            appId={appId}
            //  className={classes.drawerMenuItem}

            routes={routes.filter(route => route.name && route.isRhs)}
            sessionData={sessionData}
            isRightHandSide={true}
            setIsMobileOpen={setIsMobileOpen}>
            <Logout
              element={
                <Button variant="contained" sx={{width: '150px', margin: '0 auto'}}>
                  Sign out
                </Button>
              }></Logout>
            {window.location.pathname !== '/' && (
              <Button
                variant="contained"
                sx={{width: '150px', margin: '20px auto'}}
                disabled={isLoginButtonDisabled}
                href={'/sign-in'}>
                Log in
              </Button>
            )}
          </MenuLinksRhs>
        </Drawer>
      </nav>
      <Menu
        classes={{list: classes.l}}
        id="simple-menu"
        anchorEl={menuAnchor}
        keepMounted
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
            <MenuItem key={route.name} disabled={route.name === 'Edit Profile' || route.name === 'Settings'}>
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
