import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import RegularMTBLogo from '../../assets/logo_mtb.svg'
import BlackXIcon from '../../assets/black_x_icon.svg'
import WhiteMTBLogo from '../../assets/white_logo_mtb.svg'
import {latoFont} from '../../style/theme'
import Link from '@material-ui/core/Link'

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
    backgroundImage: 'url(' + RegularMTBLogo + ')',
    width: '40px',
    height: '40px',
    '&:hover': {
      backgroundImage: 'url(' + WhiteMTBLogo + ')',
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
        <Link
          color="inherit"
          href={'/Studies'}
          key="MY STUDIES"
          className={classes.mobileToolBarLink}>
          {logo}
        </Link>
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
