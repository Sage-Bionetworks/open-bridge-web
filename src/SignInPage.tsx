import React from 'react'
import {makeStyles, Box} from '@material-ui/core'
import ArcLogo from './assets/arc_main_logo.svg'
import AccountLogin from './components/account/AccountLogin'

const useStyles = makeStyles(theme => ({
  container: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  leftContainer: {
    height: '100%',
    width: '50%',
    backgroundColor: '#8FCDE2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    height: '100%',
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
}))

type SignInPageProps = {
  isARCApp: boolean
}

const SignInPage: React.FunctionComponent<SignInPageProps> = ({isARCApp}) => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <Box className={classes.leftContainer}>
        <img style={{height: '211px', width: '211px'}} src={ArcLogo}></img>
      </Box>
      <Box className={classes.rightContainer}>
        <AccountLogin
          callbackFn={() => {}}
          isArcSignIn={isARCApp}></AccountLogin>
      </Box>
    </Box>
  )
}

export default SignInPage
