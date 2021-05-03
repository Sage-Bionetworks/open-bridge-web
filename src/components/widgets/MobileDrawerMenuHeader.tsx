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
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
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
  type: 'IN_STUDY' | 'LOGGED_IN' | 'NOT_LOGGED_IN'
}

const MobileDrawerMenuHeader: React.FunctionComponent<MobileDrawHeaderProps> = ({
  setIsMobileOpen,
  type,
}) => {
  const classes = userStyles()
  const logo = <img src={Logo} style={{ marginRight: '12px' }}></img>
  const logoElement =
    type === 'IN_STUDY' || type === 'LOGGED_IN' ? (
      <NavLink
        to={'/studies'}
        key="studies"
        className={classes.mobileToolBarLink}
      >
        {logo}
      </NavLink>
    ) : (
      <a
        target="_blank"
        href="https://www.mobiletoolbox.org"
        className={classes.mobileToolBarLink}
      >
        {logo}
      </a>
    )

  return (
    <div className={classes.mobileHomeOptionContainer}>
      {logoElement}
      <img
        src={BLACK_X_ICON}
        onClick={() => setIsMobileOpen(false)}
        className={classes.blackXIcon}
      ></img>
    </div>
  )
}

export default MobileDrawerMenuHeader
