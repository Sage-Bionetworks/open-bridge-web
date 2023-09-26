import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React from 'react'
import {UseLoginReturn} from 'useLogin'
import ArcLogo from './assets/logo_arc_main.svg'
import MtbFinalLogo from './assets/logo_open_bridge_large.svg'
import AccountLogin from './components/account/AccountLogin'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  },
  leftContainer: {
    height: '100%',
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    height: '100%',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  arcAppBackground: {
    backgroundColor: '#8FCDE2',
  },
  mtbAppBackground: {
    backgroundColor: '#F3EFE5',
  },
  mtbContainer: {
    height: 'calc(100vh - 104px)',
    minHeight: '200px',
    [theme.breakpoints.down('lg')]: {
      height: 'calc(100vh - 46px)',
    },
  },
}))

type SignInPageProps = {
  usernameAndPasswordLogin: UseLoginReturn['usernameAndPasswordLogin']
  isARCApp?: boolean
}

const SignInPage: React.FunctionComponent<SignInPageProps> = ({isARCApp, usernameAndPasswordLogin}) => {
  const classes = useStyles()
  return (
    <Box className={clsx(classes.container, !isARCApp && classes.mtbContainer)}>
      {isARCApp && (
        <Box
          className={clsx(
            classes.leftContainer,
            isARCApp && classes.arcAppBackground,
            !isARCApp && classes.mtbAppBackground
          )}>
          <img
            alt="logo"
            style={{
              height: isARCApp ? '211px' : '160px',
              width: isARCApp ? '211px' : '95px',
            }}
            src={isARCApp ? ArcLogo : MtbFinalLogo}></img>
        </Box>
      )}
      <Box className={classes.rightContainer} sx={{width: isARCApp ? '50%' : '100%'}}>
        <AccountLogin
          callbackFn={() => {}}
          isArcSignIn={isARCApp}
          usernameAndPasswordLogin={usernameAndPasswordLogin}
        />
      </Box>
    </Box>
  )
}

export default SignInPage
