import Logo from '@assets/static/mtb_logo_static.svg'
import Logout from '@components/account/Logout'
import {Box, Button, Hidden, Menu, MenuItem} from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import {UserSessionData} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {useLocation} from 'react-router'
import {NavLink} from 'react-router-dom'
import {MenuLinks, MenuLinksRhs} from './MenuLinks'
import MobileNav from './MobileNav'

const drawerWidth = '320px'

const useStyles = makeStyles(theme => ({
  toolbarWrapper: {
    height: '104px',
    display: 'flex',

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
  },

  toolbar: {
    padding: theme.spacing(4, 0),
    justifyContent: 'space-between',

    // overflowX: 'auto',
    // minHeight: '40px',
  },
  toolbarLink: {
    margin: theme.spacing(5),
    padding: theme.spacing(0.5, 0),
    textDecoration: 'none',
    // flexShrink: 0,
    fontFamily: latoFont,
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: '18px',
    color: theme.palette.common.white,
    '&:last-child': {
      marginRight: 0,
    },
    '&:hover': {
      paddingTop: '2px',
      paddingBottom: '1px',
      borderBottom: '1px solid #fff',
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
    height: '24px',
    paddingLeft: '16px',
    // boxSizing: 'border-box',
    // paddingLeft: theme.spacing(3),
    // '&:hover': {
    //   backgroundColor: '#fff',
    // },
    //   backgroundColor: 'inherit',
    //   cursor: 'default',
    // },
    // display: 'flex',
    // alignItems: 'center',
    // borderLeft: '4px solid transparent',
  },
  selectedLink: {
    fontWeight: 'bold',
    color: '#393434;',
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
    // width: '40px',
    // height: '40px',
    // borderRadius: '50%',
    // fontFamily: latoFont,
    // cursor: 'pointer',
    // backgroundColor: '#F3F3EC',
    // alignItems: 'center',
    // justifyContent: 'center',
    // display: 'flex',
    // '&:hover, &:active': {
    //   border: '1px solid black',
    // },
    // '&$userCircleActive': {
    //   border: '1px solid black',
    // },
  },
  userCircleActive: {},
  createAccountLink: {
    // marginTop: theme.spacing(7),
    // borderBottom: '1px solid #EAEAEA',
  },
  drawerAuthOptions: {
    // justifyContent: 'flex-start',
    // height: '56px',
    // textTransform: 'uppercase',
  },
  drawerProfileOptions: {
    justifyContent: 'flex-start',
    height: '56px',
  },
  drawerProfileOptionsDisabled: {
    // justifyContent: 'flex-start',
    // height: '56px',
    // opacity: 0.5,
  },
  divider: {
    // border: '1px solid #EAEAEA',
    // width: '100%',
    // marginTop: theme.spacing(3.5),
    // marginBottom: theme.spacing(3.5),
  },
}))

type AppTopNavProps = {
  routes: {name: string; path: string; isRhs?: boolean}[]
  appId: string
  sessionData?: UserSessionData
}

const AppTopNav: FunctionComponent<AppTopNavProps> = ({
  routes,
  appId,
  sessionData,
  ...props
}: AppTopNavProps) => {
  const classes = useStyles()
  const location = useLocation()

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  // Hide the app store download page and also the sign in page from the nav.
  routes = routes.filter(
    route => route.name !== 'APP STORE' && route.name !== 'SIGN IN'
  )

  const isLoginButtonDisabled = React.useMemo(() => {
    return location.pathname.endsWith('/sign-in')
  }, [location])

  const rhsLinks = (
    <MenuLinksRhs
      className={classes.drawerMenuItem}
      disabledClassName={classes.drawerProfileOptionsDisabled}
      activeClassName={classes.drawerMenuSelectedLink}
      routes={routes.filter(route => route.name && route.isRhs)}
      sessionData={sessionData}
      isRightHandSide={true}>
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
      {window.location.pathname !== '/' && (
        <Button
          disabled={isLoginButtonDisabled}
          variant="text"
          className={clsx(classes.drawerAuthOptions, classes.drawerMenuItem)}
          href={'/sign-in'}>
          Log in
        </Button>
      )}
    </MenuLinksRhs>
  )

  return (
    <>
      {' '}
      <Hidden lgUp>
        <MobileNav sessionData={sessionData}>
          <MenuLinks
            className={classes.drawerMenuItem}
            activeClassName={classes.drawerMenuSelectedLink}
            routes={routes.filter(route => route.name && !route.isRhs)}
          />
          {rhsLinks}
        </MobileNav>
      </Hidden>
      <Hidden lgDown>
        <Box className={classes.toolbarWrapper}>
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
              className={classes.toolbarLink}
              activeClassName={classes.selectedLink}
              routes={routes.filter(route => route.name && !route.isRhs)}
            />
          </Toolbar>
        </Box>
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
              <MenuItem
                key={route.name}
                disabled={
                  route.name === 'Edit Profile' || route.name === 'Settings'
                }>
                <NavLink to={route.path}>{route.name}</NavLink>
              </MenuItem>
            ))}

          <MenuItem key={'logout'}>
            <Logout element={<div>Log out</div>}></Logout>
          </MenuItem>
        </Menu>
      </Hidden>
    </>
  )
}

export default AppTopNav
