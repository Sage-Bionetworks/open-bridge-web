import React, { FormEvent, FunctionComponent, useState } from 'react'
import { ReactComponent as SageLogo } from '../../assets/sage.svg'
import constants from '../../types/constants'
import storeService from '../../services/store_service'
import UserService from '../../services/user.service'
import PasswordReset from './PasswordReset'
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Link,
  Container,
  makeStyles,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from '@material-ui/core'
import Alert, { AlertProps } from '@material-ui/lab/Alert'

import {
  useSessionDataState,
  useSessionDataDispatch,
} from '../../helpers/AuthContext'

type AccountLoginOwnProps = {
  callbackFn: Function
}

type AccountLoginProps = AccountLoginOwnProps

const ENVIRONMENT = 'environment'
const OAUTH_STATE = 'synState'
const PHONE_SUCCESS_MSG =
  'An SMS message has been sent to that phone number; enter the code to sign in.'
const APP_KEY = 'appKey'
const SUCCESS_MSG =
  'An email has been sent to that address with instructions on changing your password.'
const COLLECTING_EMAIL = ['SignIn', 'ForgotPassword']
const OTHER_THAN_PHONE = ['SignIn', 'ExternalIdSignIn', 'ForgotPassword']

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '400px',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))



const loginWithSynapse = (event: any) => {
  // let payload = createPayload('appId');
  // let appKey = payload.appId;
  let state = new Date().getTime().toString(32)

  //storeService.set(APP_KEY, appKey);
  storeService.set(OAUTH_STATE, state)
  // storeService.set(ENVIRONMENT, self.environmentObs());
  let array = []
  array.push('response_type=code')
  array.push('client_id=' +  UserService.getOathEnvironment().client)
  array.push('scope=openid')
  array.push('state=' + encodeURIComponent(state))
  array.push('redirect_uri=' + encodeURIComponent(document.location.origin))
  array.push('claims=' + encodeURIComponent('{"id_token":{"userid":null}}'))
  window.location.replace('https://signin.synapse.org/?' + array.join('&'))

  ////
  /*localStorage.setItem('after-sso-login-url', window.location.href)
    event.preventDefault()
    const redirectUrl = this.props.googleRedirectUrl
      ? this.props.googleRedirectUrl
      : `${SynapseClient.getRootURL()}?provider=${SynapseClient.AUTH_PROVIDER}`
    SynapseClient.oAuthUrlRequest(SynapseClient.AUTH_PROVIDER, redirectUrl)
      .then((data: any) => {
        const authUrl = data.authorizationUrl
        window.location = authUrl // ping the url
      })
      .catch((err: any) => {
        console.log('Error on oAuth url ', err)
      })
  }*/
}

const loginWithPassword = (event: FormEvent) => {}
/* event.preventDefault();
  
  this.props.history.push("/home");
  } else {
  alert('Incorrect Credntials!');*/

const AccountLogin: FunctionComponent<AccountLoginProps> = ({ callbackFn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [alertMsg, setAlertMsg] = useState<
    { msg: string; type: AlertProps['severity'] } | undefined
  >()

  const [authflag, setAuthflag] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sessionData = useSessionDataState()
  const sessionUpdateFn = useSessionDataDispatch()

  const classes = useStyles()

  const signIn = async (clickEvent: React.FormEvent<HTMLElement>) => {
    clickEvent.preventDefault() // avoid page refresh

    setIsLoading(true)

    try {
      const loggedIn = await UserService.loginWithPassword(username, password)
      const consented = loggedIn.status !== 412
      if (loggedIn.ok || !consented) {
        console.log('handleLogin')
        sessionUpdateFn({
          type: 'LOGIN',
          payload: {
            ...sessionData,
            token: loggedIn.data.sessionToken,
            name: loggedIn.data.firstName,
            // consented: loggedIn.data.consented,
            // userDataGroup: loggedIn.data.dataGroups,
          },
        })
        callbackFn()
      } else {
        setAlertMsg({
          type: 'error',
          msg: `${loggedIn.status}${JSON.stringify(loggedIn.data)}`,
        })
      }
    } catch (e) {
      setAlertMsg({ type: 'error', msg: JSON.stringify(e, null, 2) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Snackbar
        open={alertMsg !== undefined}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setAlertMsg(undefined)}
      >
        <Alert onClose={() => setAlertMsg(undefined)} severity={alertMsg?.type}>
          {alertMsg?.msg}
        </Alert>
      </Snackbar>
      {!isForgotPassword && (
        <Container component="main" maxWidth="xs">
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <div className={classes.paper}>
            <Button onClick={e => loginWithSynapse(e)}>
              <SageLogo></SageLogo>
              Sign in with your Synapse account
            </Button>
            <form className={classes.form} noValidate onSubmit={e => signIn(e)}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={username}
                onChange={event => setUsername(event.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button
                    onClick={() => setIsForgotPassword(true)}
                    variant="text"
                  >
                    Forgot password?
                  </Button>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      )}

      {isForgotPassword && (
        <PasswordReset
          username={username}
          callbackFn={(success: boolean, message: string) => {
            setIsForgotPassword(false)
            setAlertMsg(
              message
                ? { msg: message, type: success ? 'success' : 'error' }
                : undefined,
            )
          }}
        ></PasswordReset>
      )}
    </>
  )
}

export default AccountLogin
