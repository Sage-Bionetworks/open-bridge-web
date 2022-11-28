import Logo from '@assets/logo_mtb_small.svg'
import ClearIcon from '@mui/icons-material/Clear'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import React from 'react'
import {NavLink} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
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
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingRight: theme.spacing(3),
    height: '100px',
    justifyContent: 'space-between',
  },
  logoImage: {
    height: '30px',
    '&:hover': {
      opacity: 0.7,
    },
  },
}))

type MobileDrawHeaderProps = {
  setIsMobileOpen: Function
  type: 'IN_STUDY' | 'LOGGED_IN' | 'NOT_LOGGED_IN'
}

const MobileDrawerMenuHeader: React.FunctionComponent<MobileDrawHeaderProps> = ({setIsMobileOpen, type}) => {
  const classes = useStyles()
  const logo = <img className={classes.logoImage} src={Logo} alt="Logo" />
  const logoElement =
    type === 'IN_STUDY' || type === 'LOGGED_IN' ? (
      <NavLink color="inherit" to={'/studies'} key="MY STUDIES" className={classes.mobileToolBarLink}>
        {logo}
      </NavLink>
    ) : (
      <a target="_blank" href="https://www.mobiletoolbox.org" className={classes.mobileToolBarLink} rel="noreferrer">
        {logo}
      </a>
    )

  return (
    <div className={classes.mobileHomeOptionContainer}>
      {logoElement}
      <ClearIcon
        onClick={() => setIsMobileOpen(false)}
        sx={{top: '5px', right: '5px', position: 'absolute'}}></ClearIcon>
    </div>
  )
}

export default MobileDrawerMenuHeader
