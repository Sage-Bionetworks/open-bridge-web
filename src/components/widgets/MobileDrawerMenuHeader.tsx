import BlackXIcon from '@assets/black_x_icon.svg'
import Logo from '@assets/logo_mtb.svg'
import {makeStyles} from '@material-ui/core/styles'
import {latoFont} from '@style/theme'
import React from 'react'
import {NavLink} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
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
    paddingRight: theme.spacing(3),
    height: '100px',
    justifyContent: 'space-between',
  },
  logoImage: {
    borderRadius: '50%',
    backgroundColor: 'black',
    backgroundPosition: '12px 4px',
    backgroundRepeat: 'no-repeat',
    border: '1px solid black',

    backgroundImage: 'url(' + Logo + ')',
    width: '45px',
    height: '45px',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
}))

type MobileDrawHeaderProps = {
  setIsMobileOpen: Function
  type: 'IN_STUDY' | 'LOGGED_IN' | 'NOT_LOGGED_IN'
}

const MobileDrawerMenuHeader: React.FunctionComponent<MobileDrawHeaderProps> =
  ({setIsMobileOpen, type}) => {
    const classes = useStyles()
    const logo = <div className={classes.logoImage}></div>
    const logoElement =
      type === 'IN_STUDY' || type === 'LOGGED_IN' ? (
        <NavLink
          color="inherit"
          to={'/Studies'}
          key="MY STUDIES"
          className={classes.mobileToolBarLink}>
          {logo}
        </NavLink>
      ) : (
        <a
          target="_blank"
          href="https://www.mobiletoolbox.org"
          className={classes.mobileToolBarLink}>
          {logo}
        </a>
      )

    return (
      <div className={classes.mobileHomeOptionContainer}>
        {logoElement}
        <img
          src={BlackXIcon}
          onClick={() => setIsMobileOpen(false)}
          className={classes.blackXIcon}></img>
      </div>
    )
  }

export default MobileDrawerMenuHeader
