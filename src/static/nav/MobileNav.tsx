import {ReactComponent as Logo} from '@assets/static/mtb_logo_static.svg'
import MobileDrawerMenuHeader from '@components/widgets/MobileDrawerMenuHeader'
import MenuIcon from '@mui/icons-material/Menu'
import {Divider, Drawer, IconButton} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {colors} from '@style/staticPagesTheme'
import {latoFont} from '@style/theme'
import {UserSessionData} from '@typedefs/types'
import React, {FunctionComponent} from 'react'

const drawerWidth = '320px'

const useStyles = makeStyles(theme => ({
  openMobileMenuButton: {
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
    backgroundColor: colors.primaryDarkBlue, //'#F8F8F8',
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

type MobileNavProps = {
  sessionData?: UserSessionData
}

const MobileNav: FunctionComponent<MobileNavProps> = ({
  sessionData,
  children,
}) => {
  const classes = useStyles()
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const menuChildren = React.Children.toArray(children)
  if (menuChildren.length < 2) {
    return <>no kids</>
  }
  return (
    <>
      {' '}
      <IconButton
        color="inherit"
        aria-label="Open drawer"
        edge="end"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={classes.openMobileMenuButton}
        size="large">
        <MenuIcon></MenuIcon>
      </IconButton>
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
            type={sessionData ? 'LOGGED_IN' : 'NOT_LOGGED_IN'}
            logoImage={<Logo style={{width: '120px'}} />}
          />

          {menuChildren[0]}
          {sessionData && <Divider className={classes.divider}></Divider>}
          {menuChildren[1]}
        </Drawer>
      </nav>
    </>
  )
}

export default MobileNav
