import React from 'react'
import {makeStyles, Box} from '@material-ui/core'
import ArcLogo from './assets/arc_main_logo.svg'
import MtbFinalLogo from './assets/mtb_final_logo.svg'
import AccountLogin from './components/account/AccountLogin'
import clsx from 'clsx'

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
    width: '50%',
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
    [theme.breakpoints.down('md')]: {
      height: 'calc(100vh - 46px)',
    },
  },
}))

type SignInPageProps = {
  isARCApp?: boolean
}

const SignInPage: React.FunctionComponent<SignInPageProps> = ({isARCApp}) => {
  const classes = useStyles()
  return (
    <Box className={clsx(classes.container, !isARCApp && classes.mtbContainer)}>
      <Box
        className={clsx(
          classes.leftContainer,
          isARCApp && classes.arcAppBackground,
          !isARCApp && classes.mtbAppBackground
        )}>
        <img
          style={{
            height: isARCApp ? '211px' : '160px',
            width: isARCApp ? '211px' : '95px',
          }}
          src={isARCApp ? ArcLogo : MtbFinalLogo}></img>
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
