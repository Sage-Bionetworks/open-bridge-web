import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../../assets/logo_mtb.svg'
import BLACK_X_ICON from '../../assets/black_x_icon.svg'
import { latoFont } from '../../style/theme'

const userStyles = makeStyles(theme => ({
  blackXIcon: {
    width: '16px',
    height: '16px',
  },
  mobileToolBarLink: {
    fontFamily: latoFont,
    fontSize: '15px',
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
    height: '64px',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(3),
    '&:hover': {
      backgroundColor: '#fff',
    },
    display: 'flex',
    alignItems: 'center',
    borderLeft: '4px solid transparent',
  },
  mobileHomeOptionContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingRight: '24px',
    height: '100px',
    justifyContent: 'space-between',
  },
}))

type MobileDrawHeaderProps = {
  setIsMobileOpen: Function
}

const MobileDrawerMenuHeader: React.FunctionComponent<MobileDrawHeaderProps> = ({
  setIsMobileOpen,
}) => {
  const classes = userStyles()
  return (
    <div className={classes.mobileHomeOptionContainer}>
      <NavLink
        to={'/'}
        key="home"
        className={classes.mobileToolBarLink}
        style={{ backgroundColor: '#f5f5f5' }}
      >
        <img src={Logo} style={{ marginRight: '12px' }}></img>
      </NavLink>
      <img
        src={BLACK_X_ICON}
        onClick={() => setIsMobileOpen(false)}
        className={classes.blackXIcon}
      ></img>
    </div>
  )
}

export default MobileDrawerMenuHeader
