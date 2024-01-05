import {ResetPassword} from '@components/account/ResetPassword'
import useFeatureToggles, {FeatureToggles, features} from '@helpers/FeatureToggle'
import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import constants from '@typedefs/constants'
import clsx from 'clsx'
import React from 'react'
import {useLocation} from 'react-router-dom'
import {UseLoginReturn} from 'useLogin'
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
  calculatedContainer: {
    height: 'calc(100vh - 104px)',
    minHeight: '200px',
    [theme.breakpoints.down('lg')]: {
      height: 'calc(100vh - 46px)',
    },
  },
}))

type SignInPageProps = {
  usernameAndPasswordLogin: UseLoginReturn['usernameAndPasswordLogin']
}

const SignInPage: React.FunctionComponent<SignInPageProps> = ({usernameAndPasswordLogin}) => {
  const classes = useStyles()
  const location = useLocation()
  const featureToggles = useFeatureToggles<FeatureToggles>()

  return (
    <Box className={clsx(classes.container, classes.calculatedContainer)}>
      <Box className={classes.rightContainer} sx={{width: '100%'}}>
        {(location.pathname === constants.publicPaths.SIGN_IN || location.pathname === '/') && (
          <AccountLogin
            callbackFn={() => {}}
            usernameAndPasswordLogin={usernameAndPasswordLogin}
          />
        )}
        {featureToggles[features.USERNAME_PASSWORD_LOGIN] &&
          location.pathname === constants.publicPaths.RESET_PASSWORD && <ResetPassword />}
      </Box>
    </Box>
  )
}

export default SignInPage
